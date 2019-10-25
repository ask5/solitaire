module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                      'src/assets/js/board.js',
                      'src/assets/js/layout.js',
                      'src/assets/js/logger.js',
                      'src/assets/js/patterns.js',
                      'src/assets/js/timer.js',
                      'src/assets/js/main.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        cssmin: {
            my_target: {
                files: {
                    'dist/main.min.css': ['src/assets/css/main.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'cssmin']);

};