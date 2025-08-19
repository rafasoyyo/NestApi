import { resolve } from "path";

process.env.TEST_DIR = resolve();
process.env.OUTPUT_DIR = resolve(__dirname, 'tmp', 'tmp_output');
process.env.INPUT_DIR = resolve(__dirname, 'tmp', 'fixtures');
