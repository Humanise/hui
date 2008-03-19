<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >

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
		<div>
			<xsl:if test="position()>1 and ../@space">
				<xsl:attribute name="style">padding-left: <xsl:value-of select="../@space"/>px;</xsl:attribute>
			</xsl:if>
			<xsl:comment/>
		<xsl:apply-templates/>
		</div>
	</div>
</xsl:template>


<xsl:template match="gui:split">
<table class="split" cellpadding="0" cellspacing="0">
<tr>
	<xsl:apply-templates select="gui:sidebar"/>
	<xsl:for-each select="gui:content">
		<td class="split_content">
			<xsl:apply-templates/>
		</td>
	</xsl:for-each>
</tr>
</table>
</xsl:template>

<xsl:template match="gui:split/gui:sidebar">
	<td class="split_sidebar"><xsl:apply-templates/></td>
</xsl:template>

<xsl:template match="gui:overflow">
<div class="overflow" id="{generate-id()}" style="height: {@height}px;">
	<xsl:apply-templates/>
</div>
<xsl:if test="@resize">
	<script type="text/javascript">
	In2iGui.get().registerOverflow('<xsl:value-of select="generate-id()"/>',<xsl:value-of select="@resize"/>);
	</script>
</xsl:if>
</xsl:template>

</xsl:stylesheet>