var gulp = require('gulp');
var webpack = require('webpack');
var gutil = require('gulp-util');

gulp.task("build", function() {
    webpack({
        entry: './src/treemap.ts',
        output: {
            filename: './build/bundle.js'
        },
        watch: true,
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader'
                }
            ]
        }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
    })
})