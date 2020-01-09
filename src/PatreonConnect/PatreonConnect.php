<?php

namespace App\PatreonConnect;

use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use App\Entity\User;
use Patreon\API;
use Patreon\OAuth;

class PatreonConnect {
	public $redirect_url;
	private $client_id;
	private $client_secret;

	private $creator_id; /* *** */

    public function __construct(Container $container) {
		$this->container = $container;

		$this->redirect_url = $this->container->get('router')->generate('patreon-connect', array(), UrlGeneratorInterface::ABSOLUTE_URL);
		$this->client_id = $this->container->getParameter('patreon_client_id');
		$this->client_secret = $this->container->getParameter('patreon_client_secret');


		$this->creator_id = $this->container->getParameter('patreon_creator_id');
		// $this->access_token = $this->container->getParameter('patreon_access_token');
	}

	public function getLoginURL() {
		// Generate the oAuth url
		$href = 'https://www.patreon.com/oauth2/authorize?response_type=code&client_id='
		. $this->client_id . '&redirect_uri=' . urlencode($this->redirect_url);

		/*
		// add state parameters
		$state = array();
		$state['final_page'] = 'http://mydomain.com/thank_you';
		$state_parameters = '&state=' . urlencode( base64_encode( json_encode( $state ) ) );
		$href .= $state_parameters;
		*/

		// in assets/images folder, there is a button image made with official Patreon assets (login_with_patreon.php).

		// add scopes
		// https://docs.patreon.com/#scopes
		$scope_parameters = '&scope='. urlencode('identity');
		$href .= $scope_parameters;

		return $href;
	}

	public function getTokens($code) {
		$oauth_client = new \Patreon\OAuth($this->client_id, $this->client_secret);
		$tokens = $oauth_client->get_tokens($code, $this->redirect_url);
		return $tokens;
	}

	public function refreshTokens($refresh_token) {
		$oauth_client = new \Patreon\OAuth($this->client_id, $this->client_secret);
		$tokens = $oauth_client->refresh_token($refresh_token, null);
		return $tokens;
	}

	public function getUser($access_token) {
		$api_client = new \Patreon\API($access_token);
		$patron_response = $api_client->fetch_user();

		return $patron_response;
	}
}