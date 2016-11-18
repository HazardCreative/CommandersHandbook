<!DOCTYPE html>
<html manifest="cache.manifest">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="mobile-web-app-capable" content="yes">

    <link rel="icon" sizes="196x196" href="img/ic_launcher_bigchub.png">
    <link rel="icon" sizes="128x128" href="img/ic_launcher_bigchub128.png">
    <link rel="apple-touch-icon" sizes="128x128" href="ic_launcher_bigchub128.png">
    <link rel="apple-touch-icon-precomposed" sizes="128x128" href="ic_launcher_bigchub128.png">
	<title>MFZ:RA Commander&#8217;s Handbook</title>
	<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400italic,700,700italic' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="themes/MFZApp.min.css" />
	<link rel="stylesheet" href="themes/jquery.mobile.icons.min.css" />
	<link rel="stylesheet" href="jq/jquery.mobile.structure-1.4.5.min.css" />
	<script src="jq/jquery-1.11.1.min.js"></script>
	<script src="jq/jquery.mobile-1.4.5.min.js"></script>
	<link rel="stylesheet" href="style.css" />

	<script src="generics.js"></script>
	<script src="models.js"></script>
	<script src="mfzch.js"></script>
	<script src="behavior.js"></script>

	<meta name="robots" content="noindex,nofollow">
</head>

<body>

<noscript>
	<p>The MFZ:RA Commander&#8217;s Handbook requires a recent browser with Javascript enabled.</p>
</noscript>

<!-- ============================ -->

<?php
include('pages/title.php');
include('pages/license.php');
include('pages/team_setup.php');
include('pages/game-deployment.php');
include('pages/active-game.php');
include('pages/loadouts.php');
include('pages/dice-roller.php');
include('pages/damage-roller.php');
include('pages/rules-reference.php');
include('pages/company-analysis.php');
include('pages/graph-key.php');
include('pages/graph-key-c.php');
include('pages/settings.php');
?>

<!-- ============================ -->

<div id="update-ready" class="ui-body ui-body-c">
	<p>An update has been downloaded and is ready to use.</p>

	<p><a href="#" id="do-update" class="ui-btn ui-btn-a ui-corner-all ui-btn-inline">Reload Now</a> <a href="#" id="no-update" class="ui-btn ui-corner-all ui-btn-inline">Later</a></p>
</div>

<script>
/*
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-54038237-1', 'auto');

$(document).on('pageshow', '[data-role=page], [data-role=dialog]', function (event, ui) {
    try {
        if ($.mobile.activePage.attr("data-url")) {
            ga('send', 'pageview', $.mobile.activePage.attr("data-url"));
        } else {
            ga('send', 'pageview');
        }
    } catch (err) {}
});
*/
</script>

</body>
</html>
