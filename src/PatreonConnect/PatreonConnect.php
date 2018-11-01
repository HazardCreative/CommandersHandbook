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

			//get user data
			$patreon_data['user_response'] = $api_client->fetch_user();

			if ($patreon_data['user_response']->has('data.id')) {
				$patreon_data['user_id'] = $patreon_data['user_response']->get('data.id');
			}
			if ($patreon_data['user_response']->has('included.0.attributes.amount_cents')) {
				$patreon_data['pledge']['amt'] = $patreon_data['user_response']->get('included.0.attributes.amount_cents');
			}
			if ($patreon_data['user_response']->has('included.0.attributes.declined_since')) {
				$patreon_data['pledge']['declined_since'] = $patreon_data['user_response']->get('included.0.attributes.declined_since');
			}

			dump($patreon_data);

			//get campaign data
//			$patreon_data['campaign'] = $api_client->fetch_campaign();

//			$campaign_id = $patreon_data['campaign']->get('data.0.id');

/*			$all_pledges = [];
			$cursor = null;
			while (true) {
			    $pledges_response = $api_client->fetch_page_of_pledges($campaign_id, 25, $cursor);
			    // loop over the pledges to get e.g. their amount and user name
			    foreach ($pledges_response->get('data')->getKeys() as $pledge_data_key) {
			        $pledge_data = $pledges_response->get('data')->get($pledge_data_key);
			        array_push($all_pledges, $pledge_data);
			    }
			    // get the link to the next page of pledges
			    if (!$pledges_response->has('links.next')) {
			        // if there's no next page, we're done!
			        break;
			    }
			    $next_link = $pledges_response->get('links.next');
			    // otherwise, parse out the cursor param
			    $next_query_params = explode("?", $next_link)[1];
			    parse_str($next_query_params, $parsed_next_query_params);
			    $cursor = $parsed_next_query_params['page']['cursor'];
			}


			dump($all_pledges);
			dump($cursor);
			*/
			/*
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
			*/

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
		// $data['patreon_data']['pledge'] = $pledge;

		return $data;
	}
}