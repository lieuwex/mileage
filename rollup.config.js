import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	input: 'web/src/index.js',
	output: {
		format: 'iife',
	},

	plugins: [
		commonjs(),

		nodeResolve({
			jsnext: true,
			main: true,
			browser: true,
		}),

		babel(),
	],
};
