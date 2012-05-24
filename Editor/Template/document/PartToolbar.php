<?php
/**
 * @package OnlinePublisher
 * @subpackage Templates.FrontPage
 */
require_once '../../../Config/Setup.php';
require_once '../../Include/Security.php';
require_once '../../Classes/Services/PartService.php';
require_once '../../Classes/Interface/In2iGui.php';

// Get variables
$partId = Request::getInt('partId');
$partType = Request::getString('partType');
$sectionId = Request::getInt('sectionId');

if (!$partType) {
	echo 'No type';
	exit;
}

$part = PartService::getController($partType);

$gui='
<gui xmlns="uri:hui" title="Toolbar">
	<controller source="js/PartToolbar.js"/>
	<controller source="../../Parts/'.$partType.'/toolbar.js"/>
	<script>
	partToolbar.pageId='.InternalSession::getPageId().';
	partToolbar.sectionId='.$sectionId.';
	partToolbar.partId='.$partId.';
	</script>
	<tabs small="true" below="true">';
		if ($part!=null && is_array($part->getToolbars())) {
			foreach ($part->getToolbars() as $title => $body) {
				$gui.='<tab title="'.$title.'" background="light">
				<toolbar fixed-height="true">
					<icon icon="common/stop" title="Annuller" click="partToolbar.cancel()"/>
					<icon icon="common/save" title="Gem" click="partToolbar.save()"/>
					<icon icon="common/delete" title="Slet" click="partToolbar.deletePart()">
						<confirm text="Er du sikker?" ok="Ja, slet" cancel="Annuller"/>
					</icon>
					<divider/>'.$body.
				'</toolbar>
				</tab>';
			}
		}
		$gui.='
		<tab title="Afstande" background="light">
			<toolbar fixed-height="true">
				<icon icon="common/stop" title="Annuller" click="partToolbar.cancel()"/>
				<icon icon="common/save" title="Gem" click="partToolbar.save()"/>
				<icon icon="common/delete" title="Slet" click="partToolbar.deletePart()">
					<confirm text="Er du sikker?" ok="Ja, slet" cancel="Annuller"/>
				</icon>
				<divider/>
				<field label="Venstre">
					<style-length-input name="marginLeft"/>
				</field>
				<field label="H&#248;jre">
					<style-length-input name="marginRight"/>
				</field>
				<field label="Top">
					<style-length-input name="marginTop"/>
				</field>
				<field label="Bund">
					<style-length-input name="marginBottom"/>
				</field>
				<divider/>
				<field label="Bredde">
					<style-length-input name="sectionWidth"/>
				</field>
				<field label="Tekstoml&#248;b">
					<segmented name="sectionFloat" allow-null="true">
						<item icon="style/float_none" value=""/>
						<item icon="style/float_left" value="left"/>
						<item icon="style/float_right" value="right"/>
					</segmented>
				</field>
			</toolbar>
		</tab>
	</tabs>
</gui>';
In2iGui::render($gui);
?>