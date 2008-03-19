<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >

<xsl:template match="gui:tabbox">
	<div class="tabbox" id="{generate-id()}">
		<div class="tabbox_top"><div><div>
			<xsl:for-each select="gui:tab">
				<div>
					<xsl:attribute name="class">
						tab
						<xsl:if test="position()=1"> tab_selected</xsl:if>
					</xsl:attribute>
					<a href="#"><xsl:value-of select="@title"/></a>
				</div>
			</xsl:for-each>
			<xsl:comment/>
		</div></div></div>
		<div class="tabbox_body">
			<div style="width: {count(gui:tab)*592}px;">
				<xsl:apply-templates select="gui:tab"/>
			</div>
		</div>
		<div class="tabbox_bottom"><div><div><xsl:comment/></div></div></div>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Tabbox('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="gui:tab">
			registerTab(<xsl:value-of select="generate-id()"/>_obj);
		</xsl:for-each>
		}
	</script>
</xsl:template>

<xsl:template match="gui:tabbox/gui:tab">
	<div class="tabbox_tab_body" id="{generate-id()}">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Tabbox.Tab('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

</xsl:stylesheet>