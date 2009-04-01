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

<xsl:template match="gui:columns">
	<table cellspacing="0" cellpadding="0" class="in2igui_columns">
		<tr>
			<xsl:apply-templates select="gui:column"/>
		</tr>
	</table>
</xsl:template>

<xsl:template match="gui:columns/gui:column">
	<td class="in2igui_columns_column">
		<xsl:if test="(position()>1 and ../@space) or @width">
			<xsl:attribute name="style">
				<xsl:if test="../@space">padding-left: <xsl:value-of select="../@space"/>px;</xsl:if>
				<xsl:if test="@width">width: <xsl:value-of select="@width"/>;</xsl:if>
			</xsl:attribute>
		</xsl:if>
		<xsl:apply-templates/>
	</td>
</xsl:template>

<xsl:template match="gui:header">
	<h2 class="in2igui_header">
		<xsl:if test="@icon"><span class="in2igui_icon_2" style="background-image: url('{$context}/In2iGui/icons/{@icon}2.png')"><xsl:comment/></span></xsl:if>
		<xsl:apply-templates/></h2>
</xsl:template>

<xsl:template match="gui:horizontal"><!-- Deprecated -->
	<div class="horizontal">
		<xsl:apply-templates select="gui:content"/>
	</div>
</xsl:template>

<xsl:template match="gui:horizontal/gui:content"><!-- Deprecated -->
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

<xsl:template match="gui:horizontal[@flexible='true']"><!-- Deprecated -->
	<table cellspacing="0" cellpadding="0" class="in2igui_horizontal_flexible">
		<tr>
			<xsl:apply-templates select="gui:content"/>
		</tr>
	</table>
</xsl:template>

<xsl:template match="gui:horizontal[@flexible='true']/gui:content"><!-- Deprecated -->
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
	<td class="split_sidebar"><div class="split_sidebar"><xsl:apply-templates/></div></td>
</xsl:template>

<xsl:template match="gui:overflow">
<div class="in2igui_overflow" id="{generate-id()}">
	<xsl:attribute name="style">
		 <xsl:if test="@height">height: <xsl:value-of select="@height"/>px;</xsl:if>
		 <xsl:if test="@max-height">max-height: <xsl:value-of select="@max-height"/>px;</xsl:if>
		 <xsl:if test="@min-height">min-height: <xsl:value-of select="@min-height"/>px;</xsl:if>
		 <xsl:if test="@width">width: <xsl:value-of select="@width"/>px;</xsl:if>
	</xsl:attribute>
	<xsl:apply-templates/>
</div>
<xsl:if test="@resize">
	<script type="text/javascript">
	In2iGui.get().registerOverflow('<xsl:value-of select="generate-id()"/>',<xsl:value-of select="@resize"/>);
	</script>
</xsl:if>
</xsl:template>

<xsl:template match="gui:box">
	<div id="{generate-id()}">
		<xsl:attribute name="class">
			<xsl:text>in2igui_box</xsl:text>
			<xsl:if test="@variant"><xsl:text> in2igui_box_</xsl:text><xsl:value-of select="@variant"/></xsl:if>
			<xsl:if test="@absolute='true'"><xsl:text> in2igui_box_absolute</xsl:text></xsl:if>
		</xsl:attribute>
		<xsl:attribute name="style">
		<xsl:if test="@width">width: <xsl:value-of select="@width"/>px;</xsl:if>
		<xsl:if test="@top">margin-top: <xsl:value-of select="@top"/>px;</xsl:if>
		</xsl:attribute>
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
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Box('<xsl:value-of select="generate-id()"/>',null,{
			<xsl:if test="@modal='true'">modal:true</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:wizard">
	<div class="in2igui_wizard" id="{generate-id()}">
		<table class="in2igui_wizard"><tr>
			<th class="in2igui_wizard">
				<ul class="in2igui_wizard">
				<xsl:for-each select="gui:step">
					<li>
						<a href="#">
						<xsl:if test="position()=1">
							<xsl:attribute name="class">in2igui_selected</xsl:attribute>
						</xsl:if>
						<xsl:if test="@icon"><span class="in2igui_icon_1" style="background-image: url('{$context}/In2iGui/icons/{@icon}1.png');')"><xsl:comment/></span></xsl:if>
						<span><xsl:value-of select="@title"/></span>
						</a>
					</li>
				</xsl:for-each>
				</ul>
			</th>
			<td class="in2igui_wizard">
				<div class="in2igui_wizard_steps">
				<xsl:for-each select="gui:step">
					<div>
						<xsl:attribute name="class">
							<xsl:text>in2igui_wizard_step</xsl:text>
							<xsl:if test="@frame='true'"><xsl:text> in2igui_wizard_step_frame</xsl:text></xsl:if>
						</xsl:attribute>
						<xsl:attribute name="style">
						<xsl:if test="@padding">
							<xsl:text>padding: </xsl:text><xsl:value-of select="@padding"/><xsl:text>px;</xsl:text>
						</xsl:if>
						<xsl:if test="position()!=1"><xsl:text>display: none;</xsl:text></xsl:if>
						</xsl:attribute>
						<xsl:apply-templates/>
					</div>
				</xsl:for-each>
				</div>
			</td>
			</tr>
		</table>
	</div>
	<script type="text/javascript">
		(function() {
			var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Wizard({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'});
			<xsl:call-template name="gui:createobject"/>
		})();
	</script>
</xsl:template>

</xsl:stylesheet>