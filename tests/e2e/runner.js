#!/usr/bin/env bun
/**
 * Expendry Opaque-Box E2E Test Runner
 * 
 * Invocation:
 *   bun tests/e2e/runner.js
 *   bun run test:e2e
 * 
 * Options:
 *   --tier=<1|2|3|4>    Run only a specific tier
 *   --feature=<F1..F8>  Filter by feature key
 *   --verbose           Print detailed diagnostic outputs
 *   --json              Emit structured JSON results
 */

import { tier1Tests } from './tier1_features.test.js';
import { tier2Tests } from './tier2_boundaries.test.js';
import { tier3Tests } from './tier3_cross_feature.test.js';
import { tier4Tests } from './tier4_scenarios.test.js';

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tier: null,
    feature: null,
    verbose: false,
    json: false
  };

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      options.tier = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--feature=')) {
      options.feature = arg.split('=')[1].toUpperCase();
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Expendry E2E Test Runner
Usage:
  bun tests/e2e/runner.js [options]
  bun run test:e2e [options]

Options:
  --tier=1|2|3|4      Execute specific tier only
  --feature=F1..F8    Filter tests matching feature
  --verbose, -v       Detailed output
  --json              Output JSON summary
  --help, -h          Show this help message
`);
      process.exit(0);
    }
  }

  return options;
}

async function runSuite() {
  const options = parseArgs();
  const startTime = Date.now();

  const allTests = [
    ...tier1Tests,
    ...tier2Tests,
    ...tier3Tests,
    ...tier4Tests
  ];

  let selectedTests = allTests;

  if (options.tier !== null) {
    selectedTests = selectedTests.filter(t => t.tier === options.tier);
  }

  if (options.feature) {
    selectedTests = selectedTests.filter(t => t.feature && t.feature.includes(options.feature));
  }

  if (!options.json) {
    console.log(`\n${ANSI.bold}${ANSI.cyan}======================================================================${ANSI.reset}`);
    console.log(`${ANSI.bold}${ANSI.green}       EXPENDRY OPAQUE-BOX END-TO-END VERIFICATION RUNNER             ${ANSI.reset}`);
    console.log(`${ANSI.bold}${ANSI.cyan}======================================================================${ANSI.reset}`);
    console.log(`${ANSI.dim}Runtime: Bun ${process.versions.bun || 'Node.js'} | Platform: ${process.platform} ${process.arch}${ANSI.reset}`);
    console.log(`${ANSI.dim}Target Chain: MST Testnet (Chain ID 91562037 / 0x5752035)${ANSI.reset}`);
    console.log(`${ANSI.dim}Contract: EXPEN ERC-20 (18 decimals, 50 EXPEN daily cap, 10 EXPEN/post)${ANSI.reset}\n`);
  }

  const results = {
    total: selectedTests.length,
    passed: 0,
    failed: 0,
    failures: [],
    tiers: {
      1: { name: 'Tier 1 — Feature Coverage (>=5 tests per feature)', passed: 0, total: 0 },
      2: { name: 'Tier 2 — Boundary & Corner Cases (>=5 tests per feature)', passed: 0, total: 0 },
      3: { name: 'Tier 3 — Cross-Feature Interactions', passed: 0, total: 0 },
      4: { name: 'Tier 4 — Real-World Application Scenarios', passed: 0, total: 0 }
    }
  };

  let currentTier = null;

  for (const test of selectedTests) {
    if (results.tiers[test.tier]) {
      results.tiers[test.tier].total++;
    }

    if (!options.json && test.tier !== currentTier) {
      currentTier = test.tier;
      console.log(`\n${ANSI.bold}${ANSI.yellow}--- ${results.tiers[currentTier].name} ---${ANSI.reset}`);
    }

    const testStart = Date.now();
    try {
      await test.fn();
      const duration = Date.now() - testStart;
      results.passed++;
      if (results.tiers[test.tier]) {
        results.tiers[test.tier].passed++;
      }

      if (!options.json) {
        const featureTag = test.feature ? ` ${ANSI.blue}[${test.feature.split(':')[0]}]${ANSI.reset}` : '';
        console.log(`  ${ANSI.green}✓${ANSI.reset} ${ANSI.bold}${test.id}${ANSI.reset}${featureTag} ${test.name} ${ANSI.gray}(${duration}ms)${ANSI.reset}`);
      }
    } catch (err) {
      const duration = Date.now() - testStart;
      results.failed++;
      results.failures.push({
        id: test.id,
        name: test.name,
        tier: test.tier,
        feature: test.feature,
        error: err.message,
        stack: err.stack
      });

      if (!options.json) {
        console.log(`  ${ANSI.red}✗${ANSI.reset} ${ANSI.bold}${test.id}${ANSI.reset} ${test.name} ${ANSI.red}(FAILED - ${duration}ms)${ANSI.reset}`);
        console.log(`    ${ANSI.red}Error: ${err.message}${ANSI.reset}`);
      }
    }
  }

  const totalDuration = Date.now() - startTime;

  if (options.json) {
    console.log(JSON.stringify({
      status: results.failed === 0 ? 'PASSED' : 'FAILED',
      durationMs: totalDuration,
      metrics: results
    }, null, 2));
  } else {
    console.log(`\n${ANSI.bold}${ANSI.cyan}======================================================================${ANSI.reset}`);
    console.log(`${ANSI.bold}                      TEST SUITE EXECUTION SUMMARY                    ${ANSI.reset}`);
    console.log(`${ANSI.bold}${ANSI.cyan}======================================================================${ANSI.reset}`);

    for (let t = 1; t <= 4; t++) {
      const tierData = results.tiers[t];
      if (tierData.total > 0) {
        const statusColor = tierData.passed === tierData.total ? ANSI.green : ANSI.red;
        console.log(`  ${statusColor}${tierData.passed === tierData.total ? '✓' : '✗'}${ANSI.reset} ${tierData.name}: ${ANSI.bold}${tierData.passed}/${tierData.total}${ANSI.reset} passed`);
      }
    }

    console.log(`${ANSI.dim}----------------------------------------------------------------------${ANSI.reset}`);
    const summaryColor = results.failed === 0 ? ANSI.green : ANSI.red;
    console.log(`  ${summaryColor}${ANSI.bold}TOTAL: ${results.passed} passed, ${results.failed} failed out of ${results.total} tests in ${totalDuration}ms${ANSI.reset}`);
    console.log(`${ANSI.bold}${ANSI.cyan}======================================================================${ANSI.reset}\n`);

    if (results.failed > 0) {
      console.log(`${ANSI.red}${ANSI.bold}FAILURES (${results.failed}):${ANSI.reset}`);
      for (const f of results.failures) {
        console.log(`\n${ANSI.red}[${f.id}] ${f.name}${ANSI.reset}`);
        console.log(`${ANSI.gray}${f.stack}${ANSI.reset}`);
      }
    } else {
      console.log(`${ANSI.green}${ANSI.bold}✨ All tests passed successfully! E2E suite verified clean.${ANSI.reset}\n`);
    }
  }

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
