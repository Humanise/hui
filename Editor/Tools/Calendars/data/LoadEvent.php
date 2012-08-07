<?php
/**
 * @package OnlinePublisher
 * @subpackage Tools.Calendars
 */
require_once '../../../Include/Private.php';

$id = Request::getInt('id');
$event = Event::load($id);

$groups = $event->getCalendarIds();

Response::sendUnicodeObject(array('event' => $event, 'calendars' => $groups));
?>