const youtube = "https://youtube.googleapis.com/youtube/v3/videos"

/*
 * Functions for Trakt API requests.
 */
async function getVideoData(videoId) {
    let reqUrl = `${youtube}?part=snippet&hl=en&id=${videoId}&locale=en&key=${process.env.YOUTUBE_CLIENT_ID}`;
    let response = await fetch(
        reqUrl,
        {
            method: "get"
        }
    );
    let data = await response.json();
    return data.items[0].snippet.localized; //return the JSON data from the response
}

module.exports = {
    getVideoData
}