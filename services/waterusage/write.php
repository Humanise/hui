<?
require_once('../../Config/Setup.php');
require_once('../../Editor/Include/Public.php');
require_once('../../Editor/Classes/Request.php');
require_once('../../Editor/Classes/Database.php');
require_once('../../Editor/Classes/Waterusage.php');
require_once('../../Editor/Classes/DateUtil.php');

$number = Request::getString('number');
$date = Request::getString('date');
$value = Request::getInt('value');
$year = 2010;

$splitted = explode("-",$date);
$date = mktime(0,0,0,$splitted[1],$splitted[2],$splitted[0]);


$dummy = new WaterUsage();
$dummy->setYear($year);
$dummy->setNumber($number);
$dummy->setValue($value);
$dummy->setDate($date);

WaterUsage::override($dummy);

$success = false;


header('Content-Type: text/xml;');
echo '<?xml version="1.0"?>'.
'<result>'.
	($success!==false ? 'true' : 'false').
'</result>';
?>