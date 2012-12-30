<?php
/**
 * @package OnlinePublisher
 * @subpackage Classes.Part
 */
if (!isset($GLOBALS['basePath'])) {
	header('HTTP/1.1 403 Forbidden');
	exit;
}

class ImagegalleryPartController extends PartController
{
	function ImagegalleryPartController() {
		parent::PartController('imagegallery');
	}
	
	function getFromRequest($id) {
		$part = ImagegalleryPart::load($id);
		$part->setHeight(Request::getInt('height',64));
		$part->setWidth(Request::getInt('imageWidth'));
		$part->setImageGroupId(Request::getInt('group'));
		$part->setFramed(Request::getBoolean('framed'));
		$part->setShowTitle(Request::getBoolean('showTitle'));
		$part->setVariant(Request::getString('variant'));
		return $part;
	}
	
	function createPart() {
		$part = new ImagegalleryPart();
		$part->setHeight(100);
		$part->setWidth(100);
		$part->setVariant('floating');
		$part->save();
		return $part;
	}
	
	function display($part,$context) {
		return $this->render($part,$context);
	}
	
	function editor($part,$context) {
		return
	    '<input type="hidden" name="group" value="'.$part->getImageGroupId().'"/>'.
	    '<input type="hidden" name="height" value="'.$part->getHeight().'"/>'.
	    '<input type="hidden" name="imageWidth" value="'.$part->getWidth().'"/>'.
	    '<input type="hidden" name="framed" value="'.StringUtils::toBoolean($part->getFramed()).'"/>'.
	    '<input type="hidden" name="showTitle" value="'.StringUtils::toBoolean($part->getShowTitle()).'"/>'.
	    '<input type="hidden" name="variant" value="'.$part->getVariant().'"/>'.
		'<script src="'.ConfigurationService::getBaseUrl().'Editor/Parts/imagegallery/editor.js" type="text/javascript" charset="utf-8"></script>'.
		'<div id="part_imagegallery_container">'.$this->render($part,$context).'</div>';
	}
		
	function buildSub($part,$context) {
		$data = '<imagegallery xmlns="'.$this->getNamespace().'" image-group="'.$part->getImageGroupId().'">';
		$data.= '<display';
		$data.= ' height="'.$part->getHeight().'"';
		if ($part->getWidth()) {
			$data.= ' width="'.$part->getWidth().'"';			
		}
		$data.= ' variant="'.StringUtils::escapeXML($part->getVariant()).'"';
		$data.= ' framed="'.StringUtils::toBoolean($part->getFramed()).'"';
		$data.= ' show-title="'.StringUtils::toBoolean($part->getShowTitle()).'"/>';
		if ($part->getImageGroupId()) {
			$sql="SELECT object.data from object,imagegroup_image where imagegroup_image.image_id = object.id and imagegroup_image.imagegroup_id=".Database::int($part->getImageGroupId())." order by object.title";
			$result = Database::select($sql);
			while ($row = Database::next($result)) {
				$data.=$row['data'];
			}
			Database::free($result);
		}
		$data.='</imagegallery>';
		return $data;
	}
	
	function importSub($node,$part) {
		$imagegallery = DOMUtils::getFirstDescendant($node,'imagegallery');
		if ($imagegallery) {
			$part->setImageGroupId(intval($imagegallery->getAttribute('image-group')));
			$display = DOMUtils::getFirstDescendant($imagegallery,'display');
			if ($display) {
				$part->setHeight(intval($display->getAttribute('height')));
				$part->setWidth(intval($display->getAttribute('width')));
				$part->setVariant($display->getAttribute('variant'));
				$part->setFramed($display->getAttribute('framed')=='true' ? true : false);
			}
		}
	}
	
	function getToolbars() {
		return array(
			'Billedgalleri' =>
				'<script source="../../Parts/imagegallery/toolbar.js"/>
				<field label="{Image group; da:Billedgruppe}">
					<dropdown width="200" name="group">
					'.GuiUtils::buildObjectItems('imagegroup').'
					</dropdown>
				</field>
				<field label="{Height; da:Højde}">
					<number-input name="height" width="70"/>
				</field>
				<field label="{Width; da:Bredde}">
					<number-input name="width" width="70"/>
				</field>
				<divider/>
				<field label="Variant">
					<dropdown name="variant">
						<item value="floating" title="{Floating; da:Flydende}"/>
						<item value="changing" title="{Shifting; da:Skiftende}"/>
					</dropdown>
				</field>
				<grid>
					<row>
						<cell right="5"><checkbox name="showTitle"/><label>{Show title; da:Vis titel}</label></cell>
					</row>
					<row>
						<cell right="5"><checkbox name="framed"/><label>{Framed; da:Indrammet}</label></cell>
					</row>
				</grid>'
		);
	}

}
?>