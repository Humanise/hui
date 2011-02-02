<?php
/**
 * @package OnlinePublisher
 * @subpackage Classes
*/

require_once($basePath.'Editor/Classes/Object.php');

Object::$schema['filegroup'] = array();

class Filegroup extends Object {

	function Filegroup() {
		parent::Object('filegroup');
	}

	function load($id) {
		return Object::get($id,'filegroup');
	}

	function removeMore() {
		$sql="delete from filegroup_file where filegroup_id=".Database::int($this->id);
		Database::delete($sql);
	}
	
	function getIn2iGuiIcon() {
        return "common/folder";
	}
}
?>