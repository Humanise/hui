<?php
/**
 * @package OnlinePublisher
 * @subpackage Tools.Sites
 */
require_once '../../../Include/Private.php';

$id = Request::getInt('id');
$obj = SpecialPage::load($id);
if ($obj) {
	Response::sendUnicodeObject($obj);
} else {
	Response::notFound();
}
?>