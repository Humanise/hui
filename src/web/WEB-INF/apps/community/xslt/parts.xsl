<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
	xmlns:h="http://uri.onlineobjects.com/model/Item/Entity/HeaderPart/"
	xmlns:html="http://uri.onlineobjects.com/model/Item/Entity/HtmlPart/"
	xmlns:imagePart="http://uri.onlineobjects.com/model/Item/Entity/ImagePart/"
	xmlns:image="http://uri.onlineobjects.com/model/Item/Entity/Image/"
	exclude-result-prefixes="e h html image"
	>
	
	<xsl:template match="e:Entity[h:HeaderPart]">
		<div class="part part_header" id="part-{@id}">
			<xsl:call-template name="margins"/>
			<h1><xsl:apply-templates/></h1>
		</div>
	</xsl:template>
	
	<xsl:template match="e:Entity[html:HtmlPart]">
		<div class="part part_html" id="part-{@id}">
			<xsl:call-template name="margins"/>
			<xsl:value-of select="." disable-output-escaping="yes"/>
		</div>
	</xsl:template>
	
	<xsl:template match="e:Entity[imagePart:ImagePart]">
		<div class="part part_image" id="part-{@id}" style="min-height: 50px;">
			<xsl:for-each select="imagePart:ImagePart/e:Entity[image:Image]">
				<img src="/test/service/image/?id={@id}&amp;height=200&amp;width=200"/>
			</xsl:for-each>
		</div>
	</xsl:template>
	
	<xsl:template name="margins">
		<xsl:attribute name="style">
			<xsl:if test="../@top"><xsl:text>margin-top:</xsl:text><xsl:value-of select="../@top"/><xsl:text>;</xsl:text></xsl:if>
			<xsl:if test="../@bottom"><xsl:text>margin-bottom:</xsl:text><xsl:value-of select="../@bottom"/><xsl:text>;</xsl:text></xsl:if>
			<xsl:if test="../@left"><xsl:text>margin-left:</xsl:text><xsl:value-of select="../@left"/><xsl:text>;</xsl:text></xsl:if>
			<xsl:if test="../@right"><xsl:text>margin-right:</xsl:text><xsl:value-of select="../@right"/><xsl:text>;</xsl:text></xsl:if>
		</xsl:attribute>
	</xsl:template>
	
</xsl:stylesheet>