const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
function analyzeURL(event){
    let target = $(event.target).siblings().length > 0 ? $(event.target) : $(event.target).parent();
    let input = target.siblings("input")[0].value;
        console.log(input);
        if (Boolean(input) && youtubeRegex.test(input) && input.match(youtubeRegex).length > 1) {
            let videoId = input.match(youtubeRegex)[1];
            window.location.replace("/video/" + videoId);
        }
}