<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	>
	<xsl:template name="in2igui">
		<xsl:call-template name="in2igui-css"/>
		<xsl:call-template name="in2igui-js"/>
	</xsl:template>
	
	<xsl:template name="in2igui-css">
		<xsl:choose>
			<xsl:when test="$development-mode='true'">
				<link rel="stylesheet" href="{$base-context}/In2iGui/css/dev.css" type="text/css" media="screen" title="front" charset="utf-8"/>
			</xsl:when>
			<xsl:otherwise>
				<link rel="stylesheet" href="{$base-context}/In2iGui/css/minimized.css" type="text/css" media="screen" title="front" charset="utf-8"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="in2igui-js">
		<xsl:choose>
			<xsl:when test="$development-mode='true'">
				<script src="{$base-context}/In2iGui/lib/prototype.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iScripts.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iInput.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iAnimation.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/swfupload/swfupload.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/In2iGui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Toolbar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Panel.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/BoundPanel.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Formula.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Alert.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Button.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Picker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Editor.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/ImageViewer.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/RichText.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Menu.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/ColorPicker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Overlay.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			</xsl:when>
			<xsl:otherwise>
				<script src="{$base-context}/In2iGui/js/minimized.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="analytics">
		<script type="text/javascript">
		var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
		document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
		</script>
		<script type="text/javascript">
		var pageTracker = _gat._getTracker("UA-420000-3");
		pageTracker._trackPageview();
		</script>
	</xsl:template>
	
</xsl:stylesheet>