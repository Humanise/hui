<?php
/**
 * @package OnlinePublisher
 * @subpackage Classes.Services
 */
if (!isset($GLOBALS['basePath'])) {
	header('HTTP/1.1 403 Forbidden');
	exit;
}
require_once($basePath.'Editor/Classes/Core/Database.php');
require_once($basePath.'Editor/Classes/Core/Log.php');

class SchemaService {
	
	function buildSqlSetters($obj,$schema) {
		$sql = '';
		$fields = isset($schema['fields']) ? $schema['fields'] : $schema;
		if (!is_array($fields)) {
			Log::debug('No fields found...');
			Log::debug($schema);
		}
		foreach ($fields as $field => $info) {
			$column = SchemaService::getColumn($field,$info);
			if (strlen($sql) > 0) {
				$sql.=',';
			}
			$sql.= "`".$column."`=";
			$getter = "get".ucfirst($field);
			if (!method_exists($obj,$getter)) {
				Log::warn($getter.' does not exist');
			}
			$value = $obj->$getter();
			$sql.= SchemaService::_formatValue($info['type'],$value);
		}
		return $sql;
	}
	
	function _formatValue($type,$value) {
		if ($type == 'int') {
			return Database::int($value);
		} else if ($type == 'float') {
			return Database::float($value);
		} else if ($type == 'boolean') {
			return Database::boolean($value);
		} else if ($type == 'datetime') {
			return Database::datetime($value);
		}
		return Database::text($value);
	}
	
	function getRowValue($type,$value) {
		if ($type == 'int') {
			return intval($value);
		} else if ($type == 'float') {
 			return floatval($row[$column]);
		} else if ($type=='datetime') {
			return $value ? intval($value) : null;
		} else if ($type=='boolean') {
			return $value==1 ? true : false;
		}
		return $value;
	}
	
	function getColumn($property,$info) {
		if (isset($info['column'])) {
			return $info['column'];
		}
		return $property;
	}

	function buildSqlColumns($schema) {
		$sql = '';
		foreach ($schema['fields'] as $field => $info) {
			$column = $field;
			if (isset($info['column'])) {
				$column = $info['column'];
			}
			if (strlen($sql)>0) {
				$sql.=',';
			}
			$sql.='`'.$column.'`';
		}
		return $sql;
	}
	
	function buildSqlValues($obj,$schema) {
		$sql = '';
		foreach ($schema['fields'] as $field => $info) {
			$column = $field;
			if (isset($info['column'])) {
				$column = $info['column'];
			}
			if (strlen($sql)>0) {
				$sql.=',';
			}
			$getter = "get".ucfirst($field);
			if (!method_exists($obj,$getter)) {
				Log::warn($getter.' does not exist');
			}
			$value = $obj->$getter();
			$sql.= SchemaService::_formatValue($info['type'],$value);
		}
		return $sql;
	}
}