<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
	xmlns:h="http://uri.onlineobjects.com/model/Item/Entity/HeaderPart/"
	xmlns:html="http://uri.onlineobjects.com/model/Item/Entity/HtmlPart/"
	exclude-result-prefixes="e h html"
	>
	
	<xsl:template match="e:Entity[h:HeaderPart]">
		<div class="part part_header" id="part-{@id}"><h1><xsl:apply-templates/></h1></div>
	</xsl:template>
	
	<xsl:template match="e:Entity[html:HtmlPart]">
		<div class="part part_html" id="part-{@id}"><xsl:value-of select="." disable-output-escaping="yes"/></div>
	</xsl:template>
	
</xsl:stylesheet>