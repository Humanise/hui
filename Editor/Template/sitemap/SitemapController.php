<?
/**
 * @package OnlinePublisher
 * @subpackage Templates.Sitemap
 */
require_once($basePath.'Editor/Classes/TemplateController.php');
require_once($basePath.'Editor/Classes/Utilities/StringUtils.php');

class SitemapController extends TemplateController {
    
    function SitemapController($id) {
        parent::TemplateController($id);
    }

	function create($page) {
		$sql="insert into sitemap (page_id,title) values (".$page->getId().",".Database::text($page->getTitle()).")";
		Database::insert($sql);
	}
	
	function delete() {
		$sql="delete from sitemap where page_id=".$this->id;
		Database::delete($sql);
		$sql="delete from sitemap_group where page_id=".$this->id;
		Database::delete($sql);
	}
    
    function build() {
		$data = '<sitemap xmlns="http://uri.in2isoft.com/onlinepublisher/publishing/sitemap/1.0/">';
		$sql="select * from sitemap where page_id=".$this->id;
		if ($row = Database::selectFirst($sql)) {
			if ($row['title']!='') {
				$data.='<title>'.StringUtils::escapeXML($row['title']).'</title>';
			}
			if ($row['text']!='') {
				$data.='<text>'.StringUtils::escapeXMLBreak($row['text'],'<break/>').'</text>';
			}
		}

		$sql="select sitemap_group.title,hierarchy.data from sitemap_group left join hierarchy on sitemap_group.hierarchy_id=hierarchy.id where page_id=".$this->id." order by sitemap_group.position";
		$result = Database::select($sql);
		while ($row = Database::next($result)) {
		    $data.='<group title="'.StringUtils::escapeXML($row['title']).'">'.
		    $row['data'].
		    '</group>';
		}
		Database::free($result);

		$data.= '</sitemap>';
        return array('data' => $data, 'dynamic' => false, 'index' => '');
    }

	function dynamic(&$state) {
		
	}
}
?>