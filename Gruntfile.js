module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: 'js/dev/*.js', // All JS in the dev folder                        
                dest: 'js/prod/main.js'
            }
        },
        uglify: {
            build: {
                src: 'js/prod/main.js',
                dest: 'js/prod/main.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['js/dev/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            }
        }
    });
        

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};