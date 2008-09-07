<?xml version="1.0"?>
<xsl:stylesheet
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >

<xsl:template match="gui:space">
	<div class="in2igui_space">
		<xsl:attribute name="style">
			<xsl:if test="@all">padding: <xsl:value-of select="@all"/>px;</xsl:if>
			<xsl:if test="@left">padding-left: <xsl:value-of select="@left"/>px;</xsl:if>
			<xsl:if test="@right">padding-right: <xsl:value-of select="@right"/>px;</xsl:if>
			<xsl:if test="@height">height: <xsl:value-of select="@height"/>px; font-size: 0px;</xsl:if>
		</xsl:attribute>
		<xsl:comment/>
		<xsl:apply-templates/>
	</div>
</xsl:template>

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
			<xsl:attribute name="style">
				<xsl:if test="position()>1 and ../@space">padding-left: <xsl:value-of select="number(../@space) div 2"/>px;</xsl:if>
				<xsl:if test="position()!=count(../gui:content) and ../@space">padding-right: <xsl:value-of select="number(../@space) div 2"/>px;</xsl:if>
			</xsl:attribute>
			<xsl:comment/>
			<xsl:apply-templates/>
		</div>
	</div>
</xsl:template>

<xsl:template match="gui:horizontal[@flexible='true']">
	<table cellspacing="0" cellpadding="0" class="in2igui_horizontal_flexible">
		<tr>
			<xsl:apply-templates select="gui:content"/>
		</tr>
	</table>
</xsl:template>

<xsl:template match="gui:horizontal[@flexible='true']/gui:content">
	<td class="in2igui_horizontal_flexible_content">
		<xsl:if test="(position()>1 and ../@space) or @width">
			<xsl:attribute name="style">
				<xsl:if test="../@space">padding-left: <xsl:value-of select="../@space"/>px;</xsl:if>
				<xsl:if test="@width">width: <xsl:value-of select="@width"/>;</xsl:if>
			</xsl:attribute>
		</xsl:if>
		<xsl:apply-templates/>
	</td>
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
<div class="in2igui_overflow" id="{generate-id()}" style="height: {@height}px;">
	<xsl:apply-templates/>
</div>
<xsl:if test="@resize">
	<script type="text/javascript">
	In2iGui.get().registerOverflow('<xsl:value-of select="generate-id()"/>',<xsl:value-of select="@resize"/>);
	</script>
</xsl:if>
</xsl:template>

<xsl:template match="gui:box">
	<div class="in2igui_box">
		<xsl:if test="@width"><xsl:attribute name="style">width: <xsl:value-of select="@width"/>px;</xsl:attribute></xsl:if>
		<div class="in2igui_box_top"><div><div><xsl:comment/></div></div></div>
		<div class="in2igui_box_middle"><div class="in2igui_box_middle">
			<xsl:if test="@title or gui:toolbar">
				<div class="in2igui_box_header">
					<xsl:attribute name="class">in2igui_box_header<xsl:if test="gui:toolbar"> in2igui_box_header_toolbar</xsl:if></xsl:attribute>
					<xsl:apply-templates select="gui:toolbar"/>
					<strong class="in2igui_box_title"><xsl:value-of select="@title"/></strong>
				</div>
			</xsl:if>
			<div class="in2igui_box_body">
				<xsl:if test="@padding"><xsl:attribute name="style">padding: <xsl:value-of select="@padding"/>px;</xsl:attribute></xsl:if>
				<xsl:apply-templates select="child::*[not(name()='toolbar')]"/>
			</div>
		</div></div>
		<div class="in2igui_box_bottom"><div><div><xsl:comment/></div></div></div>
	</div>
</xsl:template>

</xsl:stylesheet>