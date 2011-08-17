<?php
/**
 * @package OnlinePublisher
 * @subpackage Templates.ImageGallery
 */
require_once '../../../Config/Setup.php';
require_once '../../Include/Security.php';
require_once '../../Classes/Database.php';
require_once '../../Classes/Response.php';
require_once '../../Classes/Page.php';
require_once '../../Classes/InternalSession.php';
require_once '../../Classes/Request.php';

$pageId = InternalSession::getPageId();
$id = Request::getInt('id');

// Delete the object
$sql="delete from imagegallery_object where id=".$id;
Database::delete($sql);

// Fix positions
$sql = "select id from imagegallery_object where page_id=".$pageId." order by position";
$result = Database::select($sql);
$position = 1;
while ($row = Database::next($result)) {
    $sql = "update imagegallery_object set position=".$position." where id=".$row['id'];
    Database::update($sql);
    $position++;
}
Database::free($result);

PageService::markChanged($pageId);

Response::redirect('Images.php');
?>