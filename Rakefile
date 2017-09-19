task :dev do
    %x[{ 
          watchify ./js/main.js -t babelify -o ./main.js -v &
          sass --watch scss:css --style compressed
     }]
end


