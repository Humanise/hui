<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >

<xsl:output encoding="UTF-8" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:template match="gui:horizontal">
	<div class="horizontal">
		<xsl:apply-templates select="gui:content"/>
	</div>
</xsl:template>

<xsl:template match="gui:horizontal/gui:content">
	<div style="width: {100 div count(../gui:content)}%;">
		<xsl:attribute name="class">
			horizontal_content
			<xsl:if test="position()=1">horizontal_content_first</xsl:if>
		</xsl:attribute>
		<div style="padding: 0px 15px;">
		<xsl:apply-templates/>
		</div>
	</div>
</xsl:template>

</xsl:stylesheet>