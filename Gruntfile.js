module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('dev', ['browserify', 'uglify', 'watch']);
    grunt.registerTask('build', ['browserify', 'uglify']);

    grunt.initConfig({
        /**
         * Write ES6 today, compile it to ES5.
         */
        browserify: {
            dist: {
                options: {
                    transform: [
                        ['babelify', {presets: ["es2015"]}]
                    ],
                    browserifyOptions: { debug: true }
                },
                files: {
                    'build/anchart3d.js': ['src/**/*.js']
                }
            }
        },

        /**
         * Minify (uglify) the code to compress the size of the file
         */
        uglify: {
            dist: {
                src: 'build/anchart3d.js',
                dest: 'build/anchart3d.min.js'
            }
        },


            /**
         * Run predefined tasks whenever watched files are added,
         * modified or deleted.
         */
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify', 'uglify']
            }
        }
    });
};
