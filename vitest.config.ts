import { defineConfig } from 'vitest/config'
import moment from 'moment';
moment.locale('vi');
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory:  `coverage/${moment().format('YYYY-MM-DD_hhmmss')}`
    },
  },
})