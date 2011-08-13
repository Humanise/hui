<?
/**
 * @package OnlinePublisher
 * @subpackage Classes.Utilities
 */

class MarkupUtils {
	
	function findScriptSegments($str) {
		$start = '<script';
		$stop = '</script>';
		$segments = array();
		$pos = 0;
		while ($pos!==false) {
			$from = strpos($str,$start,$pos);
			if ($from===false) {
				$pos = false;
				continue;
			}
			$to = strpos($str,$stop,$from+strlen($start));
			if ($to!==false) {
				$to+=strlen($stop);
				$segments[] = array('from'=>$from,'to'=>$to);
				$pos = $to;
			} else {
				$pos = false;
			}
		}
		return $segments;
	}
}