<?xml version="1.0"?>
<xsl:stylesheet
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
>

<xsl:template match="gui:graph">
	<div class="in2igui_graph" id="{generate-id()}"><xsl:comment/></div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Graph({
			element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

</xsl:stylesheet>