<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
	xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
	xmlns:i="http://uri.onlineobjects.com/model/Item/Entity/Image/"
	xmlns:p="http://uri.onlineobjects.com/publishing/WebPage/"
	version="1.0"
	exclude-result-prefixes="e u p i">
	<xsl:output encoding="UTF-8" method="xml" omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>


	<xsl:template name="p:head">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<title>
			<xsl:value-of select="p:context/e:Entity[@type='Item/Entity/WebPage']/e:name"/><xsl:text> &#8250; </xsl:text>
			<xsl:value-of select="p:context/e:Entity[@type='Item/Entity/WebSite']/e:name"/>
		</title>
		<xsl:choose>
			<xsl:when test="$development-mode='true'">
				<link rel="stylesheet" href="{$base-context}/hui/css/dev.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<script src="{$base-context}/hui/lib/swfupload/swfupload.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/hui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/hui_animation.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/ui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Toolbar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Window.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/BoundPanel.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Formula.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Alert.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Button.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Columns.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Picker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Editor.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/ImageViewer.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/MarkupEditor.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Menu.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Bar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/ColorPicker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Overlay.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Layout.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Selection.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Box.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Gallery.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Overflow.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/LocationPicker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/TextField.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/TokenField.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/hui/js/Input.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			</xsl:when>
			<xsl:otherwise>
				<link rel="stylesheet" href="{$base-context}/hui/bin/minimized.css?{$cache-version}" type="text/css" media="screen" title="front" charset="utf-8"/>
				<script src="{$base-context}/hui/bin/minimized.js?{$cache-version}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:comment><![CDATA[[if lt IE 7]>
			<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$base-context"/>/hui/css/msie6.css?<xsl:value-of select="$cache-version"/><![CDATA["> </link>
		<![endif]]]></xsl:comment>
		<xsl:comment><![CDATA[[if IE 7]>
			<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$base-context"/>/hui/css/msie7.css?<xsl:value-of select="$cache-version"/><![CDATA["> </link>
		<![endif]]]></xsl:comment>
		<xsl:comment><![CDATA[[if IE 8]>
			<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$base-context"/>/hui/css/msie8.css?<xsl:value-of select="$cache-version"/><![CDATA["> </link>
		<![endif]]]></xsl:comment>
		<script type="text/javascript" charset="utf-8">
			hui.ui.context = '<xsl:value-of select="$base-context"/>';
			var OnlineObjects = {
				page:{id:<xsl:value-of select="@id"/>,design:'<xsl:value-of select="$page-design"/>'},
				content:{id:<xsl:value-of select="p:content/@id"/>},
				site:{id:<xsl:value-of select="p:context/e:Entity[@type='Item/Entity/WebSite']/@id"/>},
				node:{id:<xsl:value-of select="p:context/e:Entity[@type='Item/Entity/WebNode']/@id"/>},
				privilege:{modify:<xsl:value-of select="$privilege-document-modify"/>},
				baseContext:'<xsl:value-of select="$base-context"/>',
				appContext:'<xsl:value-of select="$local-context"/>'
			};
		</script>
		<xsl:if test="$privilege-document-modify='true'">
			<link rel="stylesheet" href="{$local-context}/editor/css/editor.css?{$cache-version}" type="text/css" media="screen" title="front" charset="utf-8"/>
			<script src="{$local-context}/editor/js/Editor.js?{$cache-version}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			<script src="{$base-context}/dwr/engine.js?{$cache-version}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			<script src="{$base-context}/dwr/interface/CoreSecurity.js?{$cache-version}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			<script src="{$base-context}/dwr/interface/CorePublishing.js?{$cache-version}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			<script src="{$base-context}/dwr/interface/AppCommunity.js?{$cache-version}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
			<xsl:call-template name="p:content-editor-head"/>
		</xsl:if>
		<xsl:call-template name="p:content-head"/>
	</xsl:template>
	
	<xsl:template name="p:analytics">
		<xsl:if test="$development-mode!='true'">
			<script src="http://www.google-analytics.com/ga.js" type="text/javascript"><xsl:comment/></script>
			<script type="text/javascript">
			var pageTracker = _gat._getTracker("UA-420000-3");
			pageTracker._trackPageview();
			</script>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
