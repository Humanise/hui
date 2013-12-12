<?php
/**
 * @package OnlinePublisher
 * @subpackage Classes.Network
 */
if (!isset($GLOBALS['basePath'])) {
	header('HTTP/1.1 403 Forbidden');
	exit;
}

class HttpClient {

	static function send($request) {
		$body = http_build_query($request->getParameters(),'','&');
		$session = curl_init($request->getUrl());
		if ($request->getUnicode()) {
			$headers = array(
				"Content-Type: application/x-www-form-urlencoded; charset=UTF-8"
			);
			curl_setopt($session, CURLOPT_HTTPHEADER, $headers);
		}
		curl_setopt($session, CURLOPT_POST, 1);
		curl_setopt($session, CURLOPT_POSTFIELDS, $body);
		curl_setopt($session, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($session, CURLOPT_RETURNTRANSFER, 1);
		$data = curl_exec ($session);
		$info = null;
		$errorNumber = curl_errno($session);
		if(!$errorNumber) {
			$info = curl_getinfo($session);
		} else {
			Log::debug('Error number: '.$errorNumber.' / URL: '.$request->getUrl());
		}
		curl_close ($session);
		$response = new WebResponse();
		$response->setData($data);
		if ($info!==null) {
			$response->setStatusCode($info['http_code']);
		} else {
		}
		return $response;
	}
}