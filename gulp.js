/// <binding BeforeBuild='build' />
var m = {
    'gulp': require('gulp'),
    'flog': require('fancy-log'),
    'sass': require('gulp-sass'),
    'rjs': require('requirejs'),
    'del': require('del'),
    'cleanCSS': require('gulp-clean-css'),
    'uglify': require('gulp-uglify'),
    'concat': require('gulp-concat'),
    'merge': require('merge'),
    'rename': require('gulp-rename'),
    'glob': require('glob'),
    '_': require('lodash'),
    'fs': require('fs')
};

var settings = {
    dist: './wwwroot',
    src: './Source',
    build: './wwwroot'
};

m.gulp.task('sass', function () {
    return m.gulp.src(settings.src + '/scss/default.scss')
        .pipe(m.sass().on('error', function (err) {
            m.flog("SCSS Error: " + err);
        }))
        //.pipe(m.cleanCSS({ debug: true }, function (details) {
        //    m.flog('Minify: ' + details.name + ' - ' + details.stats.originalSize + ' - ' + details.stats.minifiedSize);
        //}))
        .pipe(m.gulp.dest(settings.dist + "/css"));

});

m.gulp.task('js', function () {
    return m.gulp.src([
       // './node_modules/jquery/dist/jquery.js',
        //'./node_modules/popper.js/dist/umd/popper.js',
        //'./node_modules/bootstrap/dist/js/bootstrap.js',
        settings.src + '/js/app.js'
    ])
        // .pipe(m.uglyify())
        .pipe(m.concat('site.js'))
        .pipe(m.gulp.dest(settings.dist + "/js"));

});

m.gulp.task("minify-js", ['js'], function () {

    m.flog('Minify JS Start');

    return m.gulp.src([settings.build + '/js/*.js', settings.build + '/js/vendor/**/*.js', '!*.min.js', '!/**/*.min.js'])
        .pipe(m.uglify())
        .pipe(m.rename({ suffix: '.min' }))
        .pipe(m.gulp.dest(settings.dist + '/js'));
    //m.gutil.log('Minify JS Done');
});

m.gulp.task("minify-css", ['sass'], function () {

    m.flog('Minify CSS Start');

    return m.gulp.src([
        settings.build + '/css/*.css', '!*.min.css', '!/**/*.min.css'
    ])
        .pipe(m.cleanCSS({ debug: true }, function (details) {
            m.flog('Minify: ' + details.name + ' - ' + details.stats.originalSize + ' - ' + details.stats.minifiedSize);
        }))
        .pipe(m.rename({ suffix: '.min' }))
        .pipe(m.gulp.dest(settings.dist + "/css"));
    //m.gutil.log('Minify JS Done');
});

m.gulp.task('vendor', function () {
    m.gulp.src([
        './node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/*'
    ]).pipe(m.gulp.dest(settings.dist + '/fonts'));
});


m.gulp.task('build', ['vendor', 'minify-css', 'minify-js'], function () {
    // place code for your default task here
});


m.gulp.task('watch', () => {
    // separate this out into 3 functions because minify-js is kind of slow.
    m.gulp.watch('./Source/**/*.scss').on('change', () => {
        m.gulp.start('sass', () => {           
        });
    })
    m.gulp.watch('./Source/**/*.js').on('change', () => {
        m.gulp.start('js', () => {            
        });
    })    
});



m.gulp.task('default', ['build'], function () {
    // place code for your default task here
});