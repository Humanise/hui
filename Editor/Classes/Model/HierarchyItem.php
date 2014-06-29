<?php
/**
 * @package OnlinePublisher
 * @subpackage Classes.Model
 */
if (!isset($GLOBALS['basePath'])) {
	header('HTTP/1.1 403 Forbidden');
	exit;
}

Entity::$schema['HierarchyItem'] = array(
	'table' => 'hierarchy_item',
	'properties' => array(
		'title' => array('type'=>'string'),
		'hidden' => array('type'=>'boolean'),
		'targetType' => array('type'=>'string'),
		'targetValue' => array('type'=>'int','relations'=>array(
			array('class'=>'Page','property'=>'id'),
			array('class'=>'File','property'=>'id')
			)
		)
	)
);
class HierarchyItem extends Entity implements Loadable {
        
	var $title;
	var $hidden;
	var $canDelete;
	var $targetType;
	var $targetValue;
    var $hierarchyId;

    function HierarchyItem() {
    }
	
	function setTitle($title) {
	    $this->title = $title;
	}

	function getTitle() {
	    return $this->title;
	}
    
    function setHierarchyId($hierarchyId) {
        $this->hierarchyId = $hierarchyId;
    }
    
    function getHierarchyId() {
        return $this->hierarchyId;
    }
    

	function setHidden($hidden) {
	    $this->hidden = $hidden;
	}

	function getHidden() {
	    return $this->hidden;
	}
	
	function setCanDelete($canDelete) {
	    $this->canDelete = $canDelete;
	}

	function getCanDelete() {
	    return $this->canDelete;
	}
	
	function setTargetType($targetType) {
	    $this->targetType = $targetType;
	}

	function getTargetType() {
	    return $this->targetType;
	}
	
	function setTargetValue($targetValue) {
	    $this->targetValue = $targetValue;
	}

	function getTargetValue() {
	    return $this->targetValue;
	}
	
	static function load($id) {
		$sql = "select id,title,hidden,target_type,target_value,target_id,hierarchy_id from hierarchy_item where id=".Database::int($id);
		$result = Database::select($sql);
		$item = null;
		if ($row = Database::next($result)) {
			$item = new HierarchyItem();
			$item->setId($row['id']);
			$item->setTitle($row['title']);
			$item->setHidden($row['hidden']==1);
			$item->setTargetType($row['target_type']);
			$item->setHierarchyId(intval($row['hierarchy_id']));
			if ($row['target_type']=='page' || $row['target_type']=='pageref' || $row['target_type']=='file') {
				$item->setTargetValue($row['target_id']);
			} else {
				$item->setTargetValue($row['target_value']);
			}
			$sql="select * from hierarchy_item where parent=".Database::int($id);
			$item->canDelete = Database::isEmpty($sql);
		}
		Database::free($result);
		return $item;
	}
    
    static function loadByPageId($id) {
        $sql = "select id from `hierarchy_item` where `target_type`='page' and target_id=@int(id)";
        $result = Database::selectFirst($sql,['id'=>$id]);
        if ($result) {
            return HierarchyItem::load($result['id']);
        }
        return null;
    }
	
	function save() {
		if ($this->id>0) {
			$target_value = null;
			$target_id = null;
			if ($this->targetType=='page' || $this->targetType=='pageref' || $this->targetType=='file') {
				$target_id = $this->targetValue;
			} else {
				$target_value = $this->targetValue;
			}
			$sql="update hierarchy_item set".
			" title=".Database::text($this->title).
			",hidden=".Database::boolean($this->hidden).
			",target_type=".Database::text($this->targetType).
			",target_value=".Database::text($target_value).
			",target_id=".Database::int($target_id).
    	    ",hierarchy_id=".Database::int($this->hierarchyId).
			" where id=".$this->id;
			Database::update($sql);
			Hierarchy::markHierarchyOfItemChanged($this->id);
		}
	}
}