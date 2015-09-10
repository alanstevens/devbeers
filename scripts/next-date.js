var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

var feedcontainer=document.getElementById("dates")
var feedurl="https://www.google.com/calendar/feeds/bnrns2m03a225rq92dfpjscdl8%40group.calendar.google.com/public/basic"
var feedlimit=10

function rssfeedsetup(){
  var feedpointer = new google.feeds.Feed(feedurl)
  feedpointer.setNumEntries(feedlimit)
  feedpointer.load(displayfeed)
}

function displayfeed(result){
  if (!result.error){
    var entries=result.feed.entries
    var entry = entries[0]
    var dateText = entry.contentSnippet.substr(29,10);
    var date = new Date(dateText);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var fullDate = monthNames[monthIndex] + ' ' + day + ', ' +  year;
    var nextDate = "<a href='" + entry.link + "' target='_blank'>" + fullDate + "</a>";
    feedcontainer.innerHTML = nextDate;
  }
  else
    alert("Error fetching feeds!")
}

window.onload=function(){
  rssfeedsetup()
}
