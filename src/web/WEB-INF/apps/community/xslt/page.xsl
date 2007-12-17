<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
 xmlns:i="http://uri.onlineobjects.com/model/Item/Entity/Image/"
 xmlns:p="http://uri.onlineobjects.com/publishing/WebPage/"
 exclude-result-prefixes="e u p i"
>
	<xsl:output encoding="UTF-8" indent="yes" method="html" omit-xml-declaration="yes" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" 
doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>
	
	<xsl:template name="p:head">
				<title><xsl:value-of select="p:context/e:Entity[@type='Item/Entity/WebSite']/e:name"/></title>
				<link rel="stylesheet" href="{$app-context}/css/common.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<script type="text/javascript" charset="utf-8">
					var info = {
						page:{id:<xsl:value-of select="@id"/>},
						content:{id:<xsl:value-of select="p:content/@id"/>},
						site:{id:<xsl:value-of select="p:context/e:Entity[@type='Item/Entity/WebSite']/@id"/>},
						privilege:{modify:<xsl:value-of select="$privilege-document-modify"/>},
						baseContext:'<xsl:value-of select="$base-context"/>',
						appContext:'<xsl:value-of select="$app-context"/>'
					}
				</script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iScripts.js" type="text/javascript" charset="utf-8"></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iAnimation.js" type="text/javascript" charset="utf-8"></script>
				<xsl:choose>
				<xsl:when test="$privilege-document-modify='true'">
					<link rel="stylesheet" href="../editor/css/editor.css" type="text/css" media="screen" title="front" charset="utf-8"/>
					<link rel="stylesheet" href="{$base-context}/In2iGui/lib/In2iScripts/In2iWindow.css" type="text/css" media="screen" title="front" charset="utf-8"/>
					<link rel="stylesheet" href="{$base-context}/In2iGui/css/panel.css" type="text/css" media="screen" title="front" charset="utf-8"/>
					<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iWindow.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$base-context}/In2iGui/js/In2iGui.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$base-context}/In2iGui/js/Panel.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$app-context}/editor/js/Editor.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$app-context}/js/Window.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$app-context}/js/Widgets.js" type="text/javascript" charset="utf-8"></script>
  					<script src="{$base-context}/dwr/engine.js" type="text/javascript" charset="utf-8"></script>
  					<script src="{$base-context}/dwr/util.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$base-context}/dwr/interface/CoreSecurity.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$base-context}/dwr/interface/CommunityTool.js" type="text/javascript" charset="utf-8"></script>
					<script src="{$base-context}/dwr/interface/ImageGalleryDocument.js" type="text/javascript" charset="utf-8"></script>
					<xsl:call-template name="p:content-editor-head"/>
				</xsl:when>
				</xsl:choose>
				<xsl:call-template name="p:content-head"/>
	</xsl:template>
	
</xsl:stylesheet>