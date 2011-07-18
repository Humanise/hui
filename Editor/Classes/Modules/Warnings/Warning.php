<?php
/**
 * @package OnlinePublisher
 * @subpackage Classes.Modules.Warnings
 */

class Warning {
	
	var $text;
	var $key;
	var $entity;
	var $status;
	
	function setStatus($status) {
	    $this->status = $status;
	}

	function getStatus() {
	    return $this->status;
	}
	

	function setText($text) {
	    $this->text = $text;
	}

	function getText() {
	    return $this->text;
	}
	
	function setKey($key) {
	    $this->key = $key;
	}

	function getKey() {
	    return $this->key;
	}
	
	function setEntity($entity) {
	    $this->entity = $entity;
	}

	function getEntity() {
	    return $this->entity;
	}
}