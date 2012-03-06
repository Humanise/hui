<?php
/**
 * @package OnlinePublisher
 * @subpackage Classes.Objects
 */
if (!isset($GLOBALS['basePath'])) {
	header('HTTP/1.1 403 Forbidden');
	exit;
}
require_once($basePath.'Editor/Classes/Model/Object.php');

Object::$schema['design'] = array(
	'unique' => array('type'=>'string'),
	'parameters' => array('type'=>'string')
);
class Design extends Object {
    
    var $unique;
	var $parameters;
    
    function Design() {
		parent::Object('design');
    }

	function load($id) {
		return Object::get($id,'design');
	}
    
    function setUnique($unique) {
        $this->unique = $unique;
    }

    function getUnique() {
        return $this->unique;
    }
    
    function setParameters($parameters) {
        $this->parameters = $parameters;
    }

    function getParameters() {
        return $this->parameters;
    }
	
	function getIn2iGuiIcon() {
		return 'common/color';
	}

    //////////////////// Special ////////////////////
    
    function canRemove() {
        $sql="select count(id) as num from page where design_id=".Database::int($this->id);
        if ($row = Database::selectFirst($sql)) {
            return $row['num']==0;
        }
        return true;
    }

	function removeMore() {
        $sql='delete from design_parameter where design_id='.Database::int($this->id);
		Database::delete($sql);
	}
}
?>