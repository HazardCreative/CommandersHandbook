<?php

namespace App\PatreonConnect;

use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use App\Entity\User;
use Patreon\API;
use Patreon\OAuth;

class PatreonConnect {
	private $client_id;
	private $client_secret;
	private $creator_id;
	private $access_token;
	public $redirect_url;

    public function __construct(Container $container) {
		$this->container = $container;

		$this->client_id = $this->container->getParameter('patreon_client_id');
		$this->client_secret = $this->container->getParameter('patreon_client_secret');
		$this->creator_id = $this->container->getParameter('patreon_creator_id');
		$this->access_token = $this->container->getParameter('patreon_access_token');
		$this->redirect_url = $this->container->get('router')->generate('patreon-test', array(), UrlGeneratorInterface::ABSOLUTE_URL);
	}

	public function patreonGetClient($code = null) {

		$patreon_data = NULL;

		$oauth_client = new \Patreon\OAuth($this->client_id, $this->client_secret);
		$tokens = $oauth_client->get_tokens($code, $this->redirect_url);

		$patreon_data['code'] = $code;
		$patreon_data['tokens'] = $tokens;

		if (isset($tokens['access_token'])) {
			$patreon_data['result'] = true;

			$access_token = $tokens['access_token'];

			$api_client = new \Patreon\API($access_token);
			$patreon_data['user_response'] = $api_client->fetch_user();


			$patron = $patreon_data['user_response']['data'];
			$included = $patreon_data['user_response']['included'];
			$pledge = null;
			if ($included != null) {
			  foreach ($included as $obj) {
				if ($obj["type"] == "pledge" && $obj["relationships"]["creator"]["data"]["id"] == $creator_id) {
				  $pledge = $obj;
				  break;
				}
			  }
			}

//			$patreon_data['campaign_and_patrons_response'] = $api_client->fetch_campaign_and_patrons();
//			$patreon_data['campaign_response'] = $api_client->fetch_campaign();
//			$pledges_response = $api_client->fetch_page_of_pledges($campaign_id, 10);
		} else {
			// connect failed
			$patreon_data['result'] = false;
			$pledge = null;
		}

		$data = array();
		$data['redirect_url'] = $this->redirect_url;
		$data['patreon_data'] = $patreon_data;
		$data['patreon_data']['pledge'] = $pledge;

		return $data;
	}
}

/*
(reference for later)

		if (isset($user_response['data'])) {
			$user = $user_response['data'];
			if (isset($user_response['included'])) {
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
			}

			$user_id_map = [];
			foreach($pledges_page['included'] as $obj) {
			  if ($obj['type'] == 'user') {
				$user_id_map[$obj['id']] = $obj;
			  }
			}
			foreach($pledges_page['data'] as $pledge_obj) {
			  $user_id = $pledge_obj['relationships']['patron']['data']['id'];
			  $user_obj = $user_id_map[$user_id];
			  print_r($user_obj);
			}
		}

		// use $user, $pledge, and $campaign as desired
		// $pledges_page = $api_client->fetch_page_of_pledges($campaign_id, 10);
*/