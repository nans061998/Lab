//hide header for event list
$("#event_h2").hide();

//key and redirect uri for Oauth2 MeetUp
const CONSUMER_KEY = '4o6b9b4dbg3g2s8c0j3im11rtq';
const CONSUMER_REDIRECT_URI = 'http://localhost:3000/';

//authorizition request to MeetUp API auth
var req_auth = `https://secure.meetup.com/oauth2/authorize?client_id=${CONSUMER_KEY}&response_type=token&redirect_uri=${CONSUMER_REDIRECT_URI}`;

//Get token from url hash
var hash = new URL(window.location).hash.substring(1);

var res;

//Get dict of hash
var result = hash.split('&').reduce(function (res, item) {
  var parts = item.split('=');
  res[parts[0]] = parts[1];
  return res;
}, {});

//Get access_token
var access_token = result['access_token'];

//Get token if it is absent
if (!access_token) {
  window.location.replace(req_auth);
};

//Button function
$("#find").click(function() {

  //clear events and add header
  $("#event_list").empty();
  $("#event_h2").show();
  
  //Get params of request
  var start_date = $('#start_date').val();
  var end_date = $('#end_date').val();
  var filter = $('#filter').val();
  start_date += 'T00:00:00';
  end_date += 'T00:00:00';
  
  //request for events
  req_data = `https://api.meetup.com/find/upcoming_events?start_date_range=${start_date}&end_date_range=${end_date}&lat=37.77&lon=-122.41&text=${filter}`;

  //request to server side
  $.ajax({
    type: 'POST',
    url:   'http://localhost:3000/events',
    dataType: 'json',
    data: {access_token: access_token, href:req_data }
  }).done(function(data) {
  
    res = data.events;

    //iterate over events
    $.each(res, function (key, value) {

      //get info about event
      var name = value['name'];
      if (!name) {
        name = 'Title is not avaliable';
      };

      var localized_location= data.city['city'] + ', ' + data.city['state'];

      var description = value['description']
      if (!description) {
        description = 'Description is not avaliable';
      }

      var local_date = value['local_date']
      if (!local_date) {
        local_date = 'Date is not avaliable';
      }

      var local_time = value['local_time']
      if (!local_time) {
        local_time = 'Time is not avaliable';
      }
      
      //add cards to html 
      var html ='<div class="card mt-2">' + 
        '<div class="card-body">'+
        '<h5 class="card-title">'+ name +'</h5>'+
        '<h6 class="card-subtitle mb-2 text-muted">'+ localized_location +'</h6>'+
        '<p class="card-text">' + description + '</p>'+
        '</div>'+
        '<div class="card-footer text-muted">'+
        '<p class="card-text">'+ local_date + ' ' + local_time +'</p>'+
        '</div>'+
        '</div>';
      $("#event_list").append(html);

    });
  });

});

