<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
 xmlns:i="http://uri.onlineobjects.com/model/Item/Entity/Image/"
 xmlns:p="http://uri.onlineobjects.com/publishing/WebPage/"
 xmlns:ig="http://uri.onlineobjects.com/publishing/Document/ImageGallery/"
 exclude-result-prefixes="e u p i ig"
>
	<xsl:output encoding="UTF-8" indent="yes" method="html" omit-xml-declaration="yes" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" 
doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>	
	
	<xsl:template name="p:content-head">
		<link rel="stylesheet" href="{$app-context}/imagegallery/css/style.css" type="text/css" media="screen" title="front" charset="utf-8"/>
		<script src="{$app-context}/imagegallery/js/ImageGallery.js" type="text/javascript" charset="utf-8"></script>
	</xsl:template>
	
	<xsl:template name="p:content-editor-head">
		<link rel="stylesheet" href="{$base-context}/In2iGui/css/progressbar.css" type="text/css" media="screen" title="front" charset="utf-8"/>
		<script src="{$base-context}/In2iGui/js/ProgressBar.js" type="text/javascript" charset="utf-8"></script>
		<script src="{$base-context}/In2iGui/js/Upload.js" type="text/javascript" charset="utf-8"></script>
		<script src="{$app-context}/imagegallery/js/ImageGalleryEditor.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript">
			with (OO.Editor.ImageGallery.getInstance()) {
				imageHeight = <xsl:value-of select="//ig:ImageGallery/ig:settings/@tiledHeight"/>;
				imageWidth = <xsl:value-of select="//ig:ImageGallery/ig:settings/@tiledWidth"/>;
			}
		</script>
	</xsl:template>
	
	<xsl:template match="ig:ImageGallery">
		<div>
			<div class="gallery">
				<xsl:apply-templates/>
			</div>
		</div>
		<xsl:if test="$edit-mode='false'">
		<script type="text/javascript" charset="utf-8">
			OO.ImageGallery.getInstance().style='<xsl:value-of select="//ig:ImageGallery/ig:settings/@style"/>';
			<xsl:for-each select="//i:Image">
				OO.ImageGallery.getInstance().addImage(<xsl:value-of select="../@id"/>);
			</xsl:for-each>
		</script>
		</xsl:if>
	</xsl:template>

	<xsl:template match="ig:tiled">
		<xsl:variable name="tiledWidth" select="//ig:ImageGallery/ig:settings/@tiledWidth"/>
		<div class="grid grid_3" style="width: {($tiledWidth+80)*3}px; margin-left: -{($tiledWidth+80)*1.5}px;">
			<xsl:apply-templates/>
		</div>
	</xsl:template>

	<xsl:template match="ig:tiled/ig:row">
		<xsl:variable name="tiledWidth" select="//ig:ImageGallery/ig:settings/@tiledWidth"/>
		<xsl:variable name="tiledHeight" select="//ig:ImageGallery/ig:settings/@tiledHeight"/>
		<div class="row">
			<xsl:for-each select="e:Entity[i:Image]">
				<div class="cell" style="width: {$tiledWidth+80}px; height: {$tiledHeight+80}px;">
				<xsl:call-template name="ig:image"/>
				</div>
			</xsl:for-each>
			<div style="clear: both;"><xsl:comment/></div>
		</div>
	</xsl:template>
	
	<xsl:template match="e:Entity[i:Image]" name="ig:image">
			<xsl:apply-templates select="i:Image"/>
	</xsl:template>
	
	<xsl:template match="i:Image">
		<xsl:variable name="tiledWidth" select="//ig:ImageGallery/ig:settings/@tiledWidth"/>
		<xsl:variable name="tiledHeight" select="//ig:ImageGallery/ig:settings/@tiledHeight"/>
		<xsl:variable name="width">
			<xsl:choose>
			<xsl:when test="number(i:height) div $tiledHeight>number(i:width) div $tiledWidth">
				<xsl:value-of select="round($tiledHeight*number(i:width) div number(i:height))"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$tiledWidth"/>
			</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="height">
			<xsl:choose>
			<xsl:when test="number(i:width) div $tiledWidth>number(i:height) div $tiledHeight">
				<xsl:value-of select="round($tiledWidth*number(i:height) div number(i:width))"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$tiledHeight"/>
			</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<div class="image image_frame {//ig:ImageGallery/ig:settings/@style}" style="float: left; margin-left: {(number($tiledWidth)-number($width)) div 2}px;margin-top: {(number($tiledHeight)-number($height)) div 2}px;">
			<div class="top"><div><div></div></div></div>
			<div class="middle"><div>
			<img src="{$base-context}/service/image/?id={../@id}&amp;width={$tiledWidth}&amp;height={$tiledHeight}" style="width: {$width}px;height: {$height}px;" id="image-{../@id}"/>
			</div></div>
			<div class="bottom"><div><div></div></div></div>
		</div>
	</xsl:template>

</xsl:stylesheet>