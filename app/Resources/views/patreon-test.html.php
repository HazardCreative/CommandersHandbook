<?php

/* require_once('vendor/patreon/patreon/src/patreon.php'); */

use Patreon\API;
use Patreon\OAuth;

$client_id = $view->container->getParameter('patreon_client_id');
$client_secret = $view->container->getParameter('patreon_client_secret');
$creator_id = $view->container->getParameter('patreon_creator_id');
$access_token = $view->container->getParameter('patreon_access_token');

// $redirect_url = "http://127.0.0.1:8000/test.php"; // or whatever your redirect url is

/*
$oauth_client = new Patreon\OAuth($client_id, $client_secret);
$tokens = $oauth_client->get_tokens($_GET['code'], $redirect_url);
var_dump($tokens);
/*
$access_token = $tokens['access_token'];
*/

/*
// initially seeded from https://www.patreon.com/platform/documentation/clients,
// but on future uses you should read from a db or other store
$my_refresh_token = 'v99aiMknUbdV7lapsjHt9kjTuJajqy';

$oauth_client = new Patreon\OAuth($client_id, $client_secret);
$tokens = $oauth_client->refresh_token($my_refresh_token, "");
var_dump($tokens);

// save this off for future usage as $my_refresh_token, perhaps in your database
$new_refresh_token = $tokens['refresh_token'];
*/

$api_client = new Patreon\API($access_token);

$campaign_response = $api_client->fetch_campaign();
$campaign_id = $campaign_response['data'][0]['id'];

$user_response = $api_client->fetch_user();
$user = $user_response['data'];
$included = $user_response['included'];

$pledge = null;
$campaign = null;
if ($included != null) {
  foreach ($included as $obj) {
    if ($obj["type"] == "pledge" && $obj["relationships"]["creator"]["data"]["id"] == $creator_id) {
      $pledge = $obj;
      break;
    }
  }
  foreach ($included as $obj) {
    if ($obj["type"] == "campaign" && $obj["relationships"]["creator"]["data"]["id"] == $creator_id) {
      $campaign = $obj;
      break;
    }
  }
}

// use $user, $pledge, and $campaign as desired
$pledges_page = $api_client->fetch_page_of_pledges($campaign_id, 10);
?>

----------

<?php
/*
// initially seeded from https://www.patreon.com/platform/documentation/clients,
// but on future uses you should read from a db or other store
$my_refresh_token = 'b8dQtqjdTRZYrpLPakcwYh5DRbZ6DY';

$oauth_client = new Patreon\OAuth($client_id, $client_secret);
$tokens = $oauth_client->refresh_token($my_refresh_token, "");

// save this off for future usage as $my_refresh_token, perhaps in your database
$new_refresh_token = $tokens['refresh_token'];

$access_token = $tokens['access_token'];

$api_client = new Patreon\API($access_token);
*/
/*
$oauth_client = new Patreon\OAuth($client_id, $client_secret);
$oauth_grant_code = $_GET['code']; // or request_var("code", "ERROR: NO CODE");
 echo "oauth_grant_code = ",$oauth_grant_code,"<br/>";
$tokens = $oauth_client->get_tokens($oauth_grant_code, $redirect_url);
 echo "tokens = ",print_r($tokens),"<br/>";
// $access_token= $tokens['access_token'];
 echo "access_token = " ,$access_token,"<br>";
$api_client = new Patreon\API($access_token);
$user_response = $api_client->fetch_user();
 echo "user_response = " ,print_r($user_response),"<br>";
$user = $user_response['data'];
 echo "user = " ,print_r($user),"<br>";
$included = $user_response['included'];
$pledge = null;
$campaign = null;
if ($included != null) {
  foreach ($included as $obj) {
    if ($obj["type"] == "pledge" && $obj["relationships"]["creator"]["data"]["id"] == $creator_id) {
      $pledge = $obj;
      break;
    }
  }
  foreach ($included as $obj) {
    if ($obj["type"] == "campaign" && $obj["relationships"]["creator"]["data"]["id"] == $creator_id) {
      $campaign = $obj;
      break;
    }
  }
  echo "use " ,print_r($user), "," ,print_r($pledge), ", and" ,print_r($campaign), "as desired","<br>";
}
*/
?>
