<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:gui="uri:hui"
  xmlns:html="http://www.w3.org/1999/xhtml"
  version="1.0"
  exclude-result-prefixes="gui"
>

<xsl:output encoding="UTF-8" omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<!--doc title:'Gui' module:'base'
<gui title="«text»" state="«text»" padding="«pixels»">
    <controller source="«url»"/>
    <controller source="«url»"/>
    ···
</gui>
-->
<xsl:template match="gui:gui">
  <html class="hui">

    <head>
      <xsl:if test="$profile='true'">
        <script>
          console.profile();
          window.setTimeout(function() {console.profileEnd()},5000);
        </script>
      </xsl:if>
      <title><xsl:value-of select="@title"/></title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <xsl:choose>
        <xsl:when test="$dev='true'">
          <link rel="stylesheet" href="{$context}/hui/{$pathVersion}bin/development.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
        </xsl:when>
        <xsl:otherwise>
          <link rel="stylesheet" href="{$context}/hui/{$pathVersion}bin/minimized.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
        </xsl:otherwise>
      </xsl:choose>

      <xsl:comment><![CDATA[[if IE 8]>
        <link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/hui/]]><xsl:value-of select="$pathVersion"/><![CDATA[css/msie8.css]]><![CDATA["> </link>
      <![endif]]]></xsl:comment>
      <xsl:comment><![CDATA[[if lt IE 7]>
        <link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/hui/]]><xsl:value-of select="$pathVersion"/><![CDATA[css/msie6.css]]><![CDATA["> </link>
      <![endif]]]></xsl:comment>
      <xsl:comment><![CDATA[[if IE 7]>
        <link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/hui/]]><xsl:value-of select="$pathVersion"/><![CDATA[css/msie7.css]]><![CDATA["> </link>
      <![endif]]]></xsl:comment>

      <xsl:if test="//gui:graph">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/graph.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>
      <xsl:if test="//gui:diagram">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/diagram.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>
      <xsl:if test="//gui:keyboard-navigator">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/keyboardnavigator.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>
      <xsl:if test="//gui:chart">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/chart.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>
      <xsl:if test="//gui:tiles">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/tiles.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>
      <xsl:if test="//gui:timeline">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/timeline.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>
      <xsl:if test="//gui:skeleton">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/skeleton.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>
      <xsl:if test="//gui:media-simulator">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/mediasimulator.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:if>

      <xsl:for-each select="//gui:css">
        <link rel="stylesheet" href="{@url}" type="text/css" media="screen" title="no title" charset="utf-8"/>
      </xsl:for-each>
      <xsl:apply-templates select="gui:style"/>

      <xsl:comment><![CDATA[[if lt IE 9]>
        <script type="text/javascript" src="]]><xsl:value-of select="$context"/><![CDATA[/hui/]]><xsl:value-of select="$pathVersion"/><![CDATA[bin/compatibility.min.js]]><![CDATA["></script>
      <![endif]]]></xsl:comment>


      <xsl:choose>
        <xsl:when test="$dev='true'">
          <script type="text/javascript">
            _context = '<xsl:value-of select="$context"/>/hui';
          </script>
          <script src="{$context}/hui/bin/development.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
        </xsl:when>
        <xsl:otherwise>
          <script src="{$context}/hui/{$pathVersion}bin/minimized.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
        </xsl:otherwise>
      </xsl:choose>

      <xsl:for-each select="//gui:require">
        <script src="{$context}/hui/{$pathVersion}{@path}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:for-each>

      <xsl:if test="//gui:graph">
        <script src="{$context}/hui/{$pathVersion}js/Graph.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:chart">
        <script src="{$context}/hui/{$pathVersion}js/Chart.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:timeline">
        <script src="{$context}/hui/{$pathVersion}js/TimeLine.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:columns">
        <script src="{$context}/hui/{$pathVersion}js/Columns.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:keyboard-navigator">
        <script src="{$context}/hui/{$pathVersion}js/KeyboardNavigator.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:diagram">
        <script src="{$context}/hui/{$pathVersion}js/Drawing.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
        <script src="{$context}/hui/{$pathVersion}js/Diagram.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:tiles">
        <script src="{$context}/hui/{$pathVersion}js/Tiles.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:skeleton">
        <script src="{$context}/hui/{$pathVersion}js/Skeleton.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:pages">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/pages.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
        <script src="{$context}/hui/{$pathVersion}js/Pages.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:object-input">
        <link rel="stylesheet" href="{$context}/hui/{$pathVersion}css/objectinput.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
        <script src="{$context}/hui/{$pathVersion}js/ObjectInput.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:managed">
        <script src="{$context}/hui/{$pathVersion}js/EditManager.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>
      <xsl:if test="//gui:media-simulator">
        <script src="{$context}/hui/{$pathVersion}js/MediaSimulator.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:if>

      <xsl:for-each select="gui:localize[@source]">
        <script src="{@source}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:for-each>
      <xsl:for-each select="gui:controller[@source]">
        <script src="{@source}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:for-each>
      <xsl:for-each select="gui:controller[@url]">
        <script src="{@url}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      </xsl:for-each>

      <script type="text/javascript">
        hui.ui.context = '<xsl:value-of select="$context"/>';
        <xsl:if test="@state">
          hui.ui.state = '<xsl:value-of select="@state"/>';
        </xsl:if>
        <xsl:if test="$language">
          hui.ui.language = '<xsl:value-of select="$language"/>';
        </xsl:if>
        <xsl:for-each select="gui:controller[@source]|gui:controller[@url]">
          <xsl:if test="@name">
          if (window['<xsl:value-of select="@name"/>']!==undefined) {
            hui.ui.listen(<xsl:value-of select="@name"/>);
          }
          </xsl:if>
        </xsl:for-each>
      </script>
      <xsl:apply-templates select="gui:script"/>

      <xsl:call-template name="dwr-setup"/>
    </head>
    <body>
      <xsl:attribute name="class">
        <xsl:text>hui</xsl:text>
        <xsl:if test="@background">
          <xsl:text> hui_bg_</xsl:text><xsl:value-of select="@background"/>
        </xsl:if>
      </xsl:attribute>
      <xsl:if test="gui:dock">
        <xsl:attribute name="style">overflow:hidden;</xsl:attribute>
      </xsl:if>
      <xsl:choose>
        <xsl:when test="@padding">
          <div style="padding: {@padding}px;" class="hui_body"><xsl:apply-templates select="child::*[not(name()='style') and not(name()='script')]"/></div>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="child::*[not(name()='style') and not(name()='script')]"/>
        </xsl:otherwise>
      </xsl:choose>
    </body>
  </html>
</xsl:template>

<!--doc title:'DWR interface' module:'base'
<dwr base="«url»">
    <interface name="«text»"/>
    <interface name="«text»"/>
</dwr>
-->
<xsl:template name="dwr-setup">
  <xsl:if test="gui:dwr">
    <script src="{$context}{gui:dwr/@base}engine.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
    <xsl:for-each select="gui:dwr/gui:interface">
      <script src="{$context}{../@base}interface/{@name}.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
    </xsl:for-each>
    <script type="text/javascript">
      dwr.engine.setErrorHandler(hui.ui.dwrErrorHandler);
    </script>
  </xsl:if>
</xsl:template>




<xsl:template name="gui:createobject">
  <xsl:if test="@name and @name!='' and not(//gui:subgui[@globals='false'])">
    if (window['<xsl:value-of select="@name"/>']===undefined) {
      window['<xsl:value-of select="@name"/>'] = <xsl:value-of select="generate-id()"/>_obj;
    }
  </xsl:if>
</xsl:template>

<xsl:template name="gui:escapeScript">
  <xsl:param name="text"/>
  <xsl:choose>
    <xsl:when test='contains($text,"&apos;")'>
      <xsl:value-of select='substring-before($text,"&apos;")'/>
      <xsl:value-of select='"\&apos;"'/>
      <xsl:call-template name="gui:escapeScript">
        <xsl:with-param name="text" select='substring-after($text,"&apos;")'/>
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise>
      <xsl:value-of select="$text"/>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>




<!--doc title:'Data source' class:'hui.ui.Source' module:'base'
<source url="«url»" dwr="«text»" lazy="«boolean»">
    <parameter key="«text»" value="«expression»"/>
</source>
-->
<xsl:template match="gui:source">
  <script type="text/javascript">
    (function() {
      var parameters = [];
      <xsl:for-each select="gui:parameter">
        parameters.push({key:'<xsl:value-of select="@key"/>',value:'<xsl:value-of select="@value"/>'})
      </xsl:for-each>


      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Source({
        name : '<xsl:value-of select="@name"/>',
        parameters : parameters
        <xsl:choose>
          <xsl:when test="@url">,url:'<xsl:value-of select="@url"/>'</xsl:when>
          <xsl:when test="@dwr">,dwr:'<xsl:value-of select="@dwr"/>'</xsl:when>
        </xsl:choose>
        <xsl:if test="@lazy='true'">,lazy:true</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    })()
  </script>
</xsl:template>




<!--doc title:'Sub-GUI' module:'base'
<subgui>
    ···
</subgui>
-->
<xsl:template name="gui:subgui">
  <div>
    <xsl:apply-templates/>
  </div>
</xsl:template>




<!--doc title:'Script' module:'base'
<script>
    «text»
</script>
-->
<xsl:template match="gui:script">
  <xsl:choose>
    <xsl:when test="@url">
      <script type="text/javascript" src="{@url}" charset="utf-8"><xsl:comment/></script>
    </xsl:when>
    <xsl:otherwise>
      <script type="text/javascript">
        <xsl:apply-templates/>
      </script>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>


<xsl:template match="gui:style">
  <xsl:choose>
    <xsl:when test="@source"> <!-- deprecated -->
      <link rel="stylesheet" href="{@source}" type="text/css" media="screen" title="no title" charset="utf-8"/>
    </xsl:when>
    <xsl:when test="@url">
      <link rel="stylesheet" href="{@url}" type="text/css" media="screen" title="no title" charset="utf-8"/>
    </xsl:when>
    <xsl:otherwise>
      <style>
        <xsl:value-of select="."/>
      </style>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<!--doc title:'Listener' module:'base'
<listen>
    <«name» for="«event»">
        «text»
    </«name»>
</listen>
-->
<xsl:template match="gui:listen">
  <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
  <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
  <script type="text/javascript">
    <xsl:choose>
      <xsl:when test="@on and @for">
        (function() {
          hui.ui.listen({$<xsl:value-of select="@for"/>$<xsl:value-of select="@on"/>:function() {
          <xsl:for-each select="gui:set">
            <xsl:for-each select="@*[not(name()='on')]">
              <xsl:value-of select="../@on"/>
              <xsl:text>.set</xsl:text>
              <xsl:value-of select="translate(substring(name(),1,1),$smallcase,$uppercase)"/>
              <xsl:value-of select="substring(name(),2)"/>
              <xsl:value-of select="concat('(', . , ');')"/>
            </xsl:for-each>
          </xsl:for-each>
          <xsl:value-of select="."/>
          }})
        })()
      </xsl:when>
      <xsl:otherwise>
        hui.ui.listen({
          <xsl:value-of select="."/>
        });
      </xsl:otherwise>
    </xsl:choose>
  </script>
</xsl:template>





<!--doc title:'Dock' class:'hui.ui.Dock' module:'layout'
<dock url="«url»" frame-name="«text»" position="« top | bottom »" name="«name»">
    <sidebar>
        ···
    </sidebar>
    <tabs/> | <toolbar/>
</dock>
-->
<xsl:template match="gui:dock">
  <xsl:call-template name="gui:dock-internals"/>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Dock({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>'
      <xsl:if test="gui:tabs">,tabs:true</xsl:if>
      <xsl:if test="gui:sidebar/@collapsed='true'">,collapsed:true</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>

<xsl:template match="gui:dock[gui:sidebar]">
  <div class="hui_dock" id="{generate-id()}">
    <xsl:attribute name="class">
      <xsl:text>hui_dock</xsl:text>
      <xsl:if test="gui:sidebar/@collapsed='true'"> hui_dock_sidebar_collapsed</xsl:if>
    </xsl:attribute>
    <xsl:apply-templates select="gui:sidebar"/>
    <div class="hui_dock_sidebar_main">
      <xsl:call-template name="gui:dock-internals"/>
    </div>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Dock({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'<xsl:if test="gui:tabs">,tabs:true</xsl:if>});
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>

<xsl:template name="gui:dock-internals">
  <div>
    <xsl:attribute name="class">
      <xsl:text>hui_dock_internals</xsl:text>
      <xsl:choose>
        <xsl:when test="@position='top' or not(@position)">
          <xsl:text> hui_dock_internals_top</xsl:text>
          <xsl:if test="gui:tabs">
            <xsl:text> hui_dock_internals_top_tabs</xsl:text>
          </xsl:if>
        </xsl:when>
        <xsl:when test="@position='bottom'">
          <xsl:text> hui_dock_internals_bottom</xsl:text>
          <xsl:if test="gui:tabs">
            <xsl:text> hui_dock_internals_bottom_tabs</xsl:text>
          </xsl:if>
        </xsl:when>
      </xsl:choose>
    </xsl:attribute>
    <xsl:if test="not(gui:sidebar)">
      <xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute>
    </xsl:if>
    <div class="hui_dock_bar">
      <xsl:apply-templates select="child::*[not(name()='sidebar')]"/>
    </div>
    <div class="hui_dock_body">
      <div class="hui_dock_progress"><xsl:comment/></div>
      <xsl:choose>
        <xsl:when test="@devices='true'">
        <div class="hui_dock_devices">
          <iframe src="{@url}" frameborder="0" name="{@frame-name}" class="hui_dock_frame"><xsl:comment/></iframe>
        </div>
        </xsl:when>
        <xsl:otherwise>
      <iframe src="{@url}" frameborder="0" name="{@frame-name}" class="hui_dock_frame"><xsl:comment/></iframe>
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </div>
</xsl:template>

<xsl:template match="gui:dock/gui:sidebar">
  <div class="hui_dock_sidebar hui_context_sidebar">
    <xsl:apply-templates/>
    <xsl:comment/>
  </div>
  <div class="hui_dock_sidebar_line"><xsl:comment/></div>
</xsl:template>




<!--doc title:'Frames' module:'layout'
<frames>
  <frame name="«text»" source="«url»" scrolling="«boolean»"/>
</frames>
-->
<xsl:template match="gui:frames">
  <html>
    <head>
      <script src="{$context}/hui/{$pathVersion}bin/minimized.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
      <xsl:apply-templates select="gui:script"/>
    </head>
    <frameset rows="84,*" framespacing="0" frameborder="0" border="0">
      <xsl:for-each select="gui:frame">
        <frame noresize="noresize" src="{@source}{@url}" name="{@name}" frameborder="0" marginheight="0" marginwidth="0" border="0">
          <xsl:attribute name="scrolling">
            <xsl:choose>
              <xsl:when test="@scrolling='false'">no</xsl:when>
              <xsl:otherwise>auto</xsl:otherwise>
            </xsl:choose>
          </xsl:attribute>
        </frame>
      </xsl:for-each>
    </frameset>
  </html>
</xsl:template>





<!--doc title:'IFrame' class:'hui.ui.IFrame' module:'layout'
<iframe source="«url»" id="«text»" state="«text»" name="«name»" height="«pixels»" />
-->
<xsl:template match="gui:iframe">
  <xsl:variable name="id">
    <xsl:choose>
      <xsl:when test="@id"><xsl:value-of select="@id"/></xsl:when>
      <xsl:otherwise><xsl:value-of select="generate-id()"/></xsl:otherwise>
    </xsl:choose>
  </xsl:variable>
  <iframe id="{$id}" name="{$id}" src="{@source}{@url}" frameborder="0">
    <xsl:attribute name="style">
      <xsl:text>width: 100%; background: #fff; display: block;</xsl:text>
    <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
      <xsl:text>display:none;</xsl:text>
    </xsl:if>
      <xsl:choose>
        <xsl:when test="@height"><xsl:text>height: </xsl:text><xsl:value-of select="@height"/><xsl:text>px;</xsl:text></xsl:when>
        <xsl:otherwise>height: 100%;</xsl:otherwise>
      </xsl:choose>
      <xsl:if test="@border='true'">
        <xsl:text>border: 1px solid #ddd; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;</xsl:text>
      </xsl:if>
    </xsl:attribute>
    <xsl:comment/>
  </iframe>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.IFrame({
      element:'<xsl:value-of select="$id"/>',
      name:'<xsl:value-of select="@name"/>'
      <xsl:if test="@state">
        ,state:'<xsl:value-of select="@state"/>'
      </xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>



<!--doc title:'Selection' class:'hui.ui.Selection' module:'selection'
<selection name="«name»" value="«text»" state="«text»" value="«text»">
    <item value="«text»" title="«text»" badge="«text»" icon="«icon»" />
    <items ··· />
    <title>«text»</title>
</selection>
-->
<xsl:template match="gui:selection">
  <div class="hui_selection" id="{generate-id()}">
    <xsl:if test="@top">
      <xsl:attribute name="style">margin-top: <xsl:value-of select="@top"/>px;</xsl:attribute>
    </xsl:if>
    <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
      <xsl:attribute name="style">display:none</xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </div>
  <script type="text/javascript">
    !function() {
      var items = [];
      <xsl:for-each select="gui:item | gui:option">
      items.push({
        id : '<xsl:value-of select="generate-id()"/>',
        title : '<xsl:value-of select="@title"/><xsl:value-of select="@text"/>',
        icon : '<xsl:value-of select="@icon"/>',
        badge : '<xsl:value-of select="@badge"/>',
        value : '<xsl:value-of select="@value"/>',
        kind : '<xsl:value-of select="@kind"/>'
      });
      </xsl:for-each>


    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Selection({
      element : '<xsl:value-of select="generate-id()"/>',
      name : '<xsl:value-of select="@name"/>',
      state : '<xsl:value-of select="@state"/>',
      items : items
      <xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
    });
    with (<xsl:value-of select="generate-id()"/>_obj) {
      <xsl:for-each select="gui:items | gui:options">
        registerItems(<xsl:value-of select="generate-id()"/>_obj);
      </xsl:for-each>
    }
    <xsl:call-template name="gui:createobject"/>
    }();
  </script>
</xsl:template>

<xsl:template match="gui:selection/gui:item | gui:selection/gui:option">
  <div id="{generate-id()}">
    <xsl:attribute name="class">hui_selection_item<xsl:if test="@value=../@value"> hui_selected</xsl:if></xsl:attribute>
    <xsl:if test="@badge"><strong class="hui_selection_badge"><xsl:value-of select="@badge"/></strong></xsl:if>
    <xsl:if test="@icon">
      <span>
        <xsl:attribute name="style">background-image: url('<xsl:value-of select="$context"/>/hui/icons/<xsl:value-of select="@icon"/>16.png');</xsl:attribute>
        <xsl:attribute name="class">hui_icon_1</xsl:attribute>
        <xsl:comment/>
      </span>
    </xsl:if>
    <span class="hui_selection_label">
    <xsl:value-of select="@title"/><xsl:value-of select="@text"/> <!-- TODO title is deprecated -->
    </span>
  </div>
</xsl:template>



<!--doc title:'Selection items' class:'hui.ui.Selection.Items' module:'selection'
<selection ···>
    <items name="«text»" title="«text»" source="«source»" title="«text»" />
</selection>
-->
<xsl:template match="gui:selection/gui:items | gui:selection/gui:options">
  <xsl:if test="@title">
    <div class="hui_selection_title" id="{generate-id()}_title" style="display: none;"><span><xsl:value-of select="@title"/></span></div>
  </xsl:if>
  <div id="{generate-id()}">
    <xsl:comment/>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Selection.Items({
      element:'<xsl:value-of select="generate-id()"/>'
      ,name:'<xsl:value-of select="@name"/>'
      <xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>

<xsl:template match="gui:selection/gui:title">
  <div class="hui_selection_title"><span><xsl:value-of select="."/></span></div>
</xsl:template>





<!--doc title:'List' class:'hui.ui.List' module:'selection'
<list name="«text»" state="«text»" url="«url»" source="«source»" selectable="«boolean»">
    <window size="«integer»" />
    <column key="«text»" title="«text»" width="«'min'»" />
</list>
-->
<xsl:template match="gui:list">
  <div id="{generate-id()}">
    <xsl:attribute name="class">
      <xsl:text>hui_list</xsl:text>
      <xsl:if test="@variant">
        <xsl:text> hui_list_</xsl:text><xsl:value-of select="@variant"/>
      </xsl:if>
    </xsl:attribute>
    <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state) or @visible='false'">
      <xsl:attribute name="style">display:none</xsl:attribute>
    </xsl:if>
    <div class="hui_list_progress"><xsl:comment/></div>
    <div class="hui_list_navigation">
      <div class="hui_list_selection window_page"><div><div class="window_page_body"><xsl:comment/></div></div></div>
      <span class="hui_list_count"><xsl:comment/></span>
    </div>
    <div class="hui_list_body">
      <table class="hui_list_table">
        <thead>
          <tr>
          <xsl:apply-templates select="gui:column"/>
          </tr>
        </thead>
        <tbody>
          <xsl:if test="not(@selectable) or @selectable='true'">
            <xsl:attribute name="class">hui_list_selectable</xsl:attribute>
          </xsl:if>
          <xsl:comment/>
        </tbody>
      </table>
      <xsl:if test="gui:empty">
        <div class="hui_list_empty">
          <xsl:apply-templates select="gui:empty"/>
        </div>
      </xsl:if>
      <xsl:if test="gui:error">
        <div class="hui_list_error_content">
          <xsl:if test="gui:error/@text">
            <p class="hui_list_error_text"><xsl:value-of select="gui:error/@text"/></p>
          </xsl:if>
          <xsl:apply-templates select="gui:error"/>
        </div>
      </xsl:if>
    </div>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.List({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>',
      url:'<xsl:value-of select="@url"/>',
      <xsl:if test="@source">source:<xsl:value-of select="@source"/>,</xsl:if>
      <xsl:if test="@selectable">selectable:<xsl:value-of select="@selectable"/>,</xsl:if>
      state:'<xsl:value-of select="@state"/>',
      windowSize:'<xsl:value-of select="gui:window/@size"/>'
      <xsl:if test="@drop-files='true'">,dropFiles:true</xsl:if>
      <xsl:if test="@indent">,indent:<xsl:value-of select="@indent"/></xsl:if>
      <xsl:if test="@remember='true'">,rememberSelection:true</xsl:if>
    });
    with (<xsl:value-of select="generate-id()"/>_obj) {
      <xsl:for-each select="gui:column">
        registerColumn({key:'<xsl:value-of select="@key"/>',title:'<xsl:value-of select="@title"/>'});
      </xsl:for-each>
    }
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>

<xsl:template match="gui:list/gui:window"></xsl:template>

<xsl:template match="gui:column">
  <th>
    <xsl:if test="@width='min'">
      <xsl:attribute name="style">width: 1%;</xsl:attribute>
    </xsl:if>
    <xsl:value-of select="@title"/>
  </th>
</xsl:template>






<!--doc title:'Tabs' class:'hui.ui.Tabs' module:'layout'
<tabs name="«text»" small="«boolean»" centered="«boolean»" below="«boolean»">
    <tab title="«text»" padding="«pixels»">
        ···
    </tab>
    <tab title="«text»" padding="«pixels»">
        ···
    </tab>
</tabs>
-->
<xsl:template match="gui:tabs">
<div id="{generate-id()}" class="hui_tabs">
  <xsl:if test="@below='true'">
    <xsl:apply-templates select="gui:tab"/>
  </xsl:if>
  <div>
    <xsl:attribute name="class">
      <xsl:text>hui_tabs_bar</xsl:text>
      <xsl:choose>
        <xsl:when test="@small='true' and @below='true'">
          <xsl:text> hui_tabs_bar_small_below</xsl:text>
        </xsl:when>
        <xsl:when test="@small='true'">
          <xsl:text> hui_tabs_bar_small</xsl:text>
        </xsl:when>
      </xsl:choose>
      <xsl:if test="@centered='true'">
        <xsl:text> hui_tabs_bar_centered</xsl:text>
      </xsl:if>
    </xsl:attribute>
    <ul>
    <xsl:for-each select="gui:tab">
      <li id="{generate-id()}_tab">
        <xsl:if test="position()=1">
          <xsl:attribute name="class">hui_tabs_selected</xsl:attribute>
        </xsl:if>
        <a><span><span><xsl:value-of select="@title"/></span></span></a>
      </li>
    </xsl:for-each>
    </ul>
  </div>
  <xsl:if test="not(@below='true')">
    <xsl:apply-templates select="gui:tab"/>
  </xsl:if>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Tabs({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>'
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</div>
</xsl:template>

<xsl:template match="gui:tabs/gui:tab">
  <div class="" id="{generate-id()}">
    <xsl:attribute name="class">
      <xsl:choose>
        <xsl:when test="@background='light'"><xsl:text>hui_tabs_tab hui_tabs_tab_light</xsl:text></xsl:when>
        <xsl:otherwise><xsl:text>hui_tabs_tab</xsl:text></xsl:otherwise>
      </xsl:choose>
    </xsl:attribute>
    <xsl:attribute name="style">
      <xsl:if test="position()>1">display: none;</xsl:if>
      <xsl:if test="@padding">padding: <xsl:value-of select="@padding"/>px;</xsl:if>
    </xsl:attribute>
    <xsl:apply-templates/>
  </div>
</xsl:template>






<!--doc title:'Bound panel' class:'hui.ui.BoundPanel' module:'container'
<boundpanel name="«name»" target="«name»" width="«pixels»" padding="«pixels»">
    ···
</boundpanel>
-->
<xsl:template match="gui:boundpanel">
  <div id="{generate-id()}" style="display:none;">
    <xsl:attribute name="class">
      <xsl:text>hui_boundpanel</xsl:text>
      <xsl:if test="@variant">
        <xsl:text> hui_boundpanel_</xsl:text><xsl:value-of select="@variant"/>
      </xsl:if>
    </xsl:attribute>
    <div class="hui_boundpanel_arrow"><xsl:comment/></div>
    <div class="hui_boundpanel_top"><div><div><xsl:comment/></div></div></div>
    <div class="hui_boundpanel_body">
      <div class="hui_boundpanel_body">
        <div class="hui_boundpanel_body">
          <div class="hui_boundpanel_content">
            <xsl:attribute name="style">
              <xsl:if test="@width">width:<xsl:value-of select="@width"/>px;</xsl:if>
              <xsl:if test="@padding">padding:<xsl:value-of select="@padding"/>px;</xsl:if>
            </xsl:attribute>
            <xsl:apply-templates/>
            <xsl:comment/>
          </div>
        </div>
      </div>
    </div>
    <div class="hui_boundpanel_bottom"><div><div><xsl:comment/></div></div></div>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.BoundPanel({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>'
      <xsl:if test="@target">,target:'<xsl:value-of select="@target"/>'</xsl:if>
      <xsl:if test="@variant">,variant:'<xsl:value-of select="@variant"/>'</xsl:if>
      <xsl:if test="@modal='true'">,modal:true</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>





<!--doc title:'Window' class:'hui.ui.Window' module:'container'
<window name="«name»" title="«text»" icon="«icon»" close="«boolean»" width="«pixels»" padding="«pixels»" variant="« dark | light | news »">
    ···
    <back>
        ···
    </back>
</window>
-->
<xsl:template match="gui:window">
  <div id="{generate-id()}">
    <xsl:attribute name="class">
      <xsl:text>hui_window</xsl:text>
      <xsl:if test="@variant">
        <xsl:text> hui_window_</xsl:text><xsl:value-of select="@variant"/>
      </xsl:if>
      <xsl:if test="@variant='dark'">
        <xsl:text> hui_context_dark</xsl:text>
      </xsl:if>
    </xsl:attribute>
    <xsl:apply-templates select="gui:back"/>
    <div class="hui_window_front">
      <xsl:if test="not(@close='false') and not(@closable='false')"> <!-- TODO close is deprecated -->
        <div class="hui_window_close"><xsl:comment/></div>
      </xsl:if>
      <div class="hui_window_titlebar"><div><div>
        <xsl:if test="@icon">
          <span class="hui_window_icon" style="background-image: url('{$context}/hui/icons/{@icon}16.png')"></span>
        </xsl:if>
        <span class="hui_window_title"><xsl:value-of select="@title"/></span>
      </div></div></div>
      <div class="hui_window_content"><div class="hui_window_content"><div class="hui_window_body">
        <xsl:attribute name="style">
          <xsl:if test="@width">width: <xsl:value-of select="@width"/>px;</xsl:if>
          <xsl:if test="@padding">padding: <xsl:value-of select="@padding"/>px;</xsl:if>
        </xsl:attribute>
        <xsl:apply-templates select="child::*[not(name()='back')]"/>
      </div></div></div>
      <div class="hui_window_bottom"><div class="hui_window_bottom"><div class="hui_window_bottom"><xsl:comment/></div></div></div>
    </div>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Window({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>'
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>

<xsl:template match="gui:window/gui:back">
  <div class="hui_window_back">
    <xsl:apply-templates/>
    <xsl:comment/>
  </div>
</xsl:template>





<!--doc title:'Upload' class:'hui.ui.Upload' module:'unknown'
<upload name="«name»" url="«url»" button="«text»" chooseButton="«name»" widget="«name»">
    <placeholder title="«text»" text="«text»"/>
</upload>
-->
<xsl:template match="gui:upload">
  <div class="hui_upload" id="{generate-id()}">
    <div class="hui_upload_items"><xsl:comment/></div>
    <div class="hui_upload_status"><xsl:comment/></div>
    <xsl:apply-templates/>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Upload({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>',
      url:'<xsl:value-of select="@url"/>',
      button:'<xsl:value-of select="@button"/>'
      <xsl:if test="@multiple">,multiple:<xsl:value-of select="@multiple='true'"/></xsl:if>
      <xsl:if test="@chooseButton">,chooseButton:'<xsl:value-of select="@chooseButton"/>'</xsl:if>
      <xsl:if test="@widget">,widget:'<xsl:value-of select="@widget"/>'</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>

<xsl:template match="gui:upload/gui:placeholder">
  <div class="hui_upload_placeholder">
    <span class="hui_upload_icon"><xsl:comment/></span>
    <xsl:if test="@title"><h2><xsl:value-of select="@title"/></h2></xsl:if>
    <xsl:if test="@text"><p><xsl:value-of select="@text"/></p></xsl:if>
  </div>
</xsl:template>




<!--
doc title:'Rich text' class:'hui.ui.RichText'
<richtext name="«name»" height="«pixels»" />

<xsl:template match="gui:richtext">
  <div class="hui_richtext" id="{generate-id()}">
    <div class="hui_richtext_toolbar" id="{generate-id()}_toolbar"><div class="hui_richtext_inner_toolbar"><div class="hui_richtext_toolbar_content" id="{generate-id()}_toolbar_content"><xsl:comment/></div></div></div>
    <iframe id="{generate-id()}_iframe" style="width: 100%; height: {@heigth}px;" frameborder="0"/>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.RichText({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </div>
</xsl:template>
-->




<!--doc title:'Gallery' class:'hui.ui.Gallery' module:'selection'
<gallery name="«name»" source="«name»" padding="«pixels»" state="«state»" drop-files="«boolean»"/>
-->
<xsl:template match="gui:gallery">
  <div class="hui_gallery" id="{generate-id()}">
    <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
      <xsl:attribute name="style">display:none</xsl:attribute>
    </xsl:if>
    <div class="hui_gallery_progress"><xsl:comment/></div>
    <div class="hui_gallery_body">
      <xsl:if test="@padding"><xsl:attribute name="style">padding:<xsl:value-of select="@padding"/>px;</xsl:attribute></xsl:if>
      <xsl:comment/>
      <xsl:text>&#160;</xsl:text>
    </div>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Gallery({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>'
      <xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
      <xsl:if test="@state">,state:'<xsl:value-of select="@state"/>'</xsl:if>
      <xsl:if test="@drop-files='true'">,dropFiles:true</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>






<!--doc title:'Calendar' class:'hui.ui.Calendar' module:'selection'
<calendar name="«name»" source="«name»" start-hour="«integer»" end-hour="«integer»" />
-->
<xsl:template match="gui:calendar">
  <div class="hui_calendar" id="{generate-id()}">
    <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
      <xsl:attribute name="style">display:none</xsl:attribute>
    </xsl:if>
  <div class="hui_calendar_bar">
    <xsl:comment/>
  </div>
  <table class="hui_calendar_weekview">
    <thead>
    <tr>
      <th class="day"><xsl:comment/></th>
      <th class="day"><xsl:comment/></th>
      <th class="day"><xsl:comment/></th>
      <th class="day"><xsl:comment/></th>
      <th class="day"><xsl:comment/></th>
      <th class="day"><xsl:comment/></th>
      <th class="day"><xsl:comment/></th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td><div class="hui_calendar_day"><xsl:comment/></div></td>
      <td><div class="hui_calendar_day"><xsl:comment/></div></td>
      <td><div class="hui_calendar_day"><xsl:comment/></div></td>
      <td><div class="hui_calendar_day"><xsl:comment/></div></td>
      <td><div class="hui_calendar_day"><xsl:comment/></div></td>
      <td><div class="hui_calendar_day"><xsl:comment/></div></td>
      <td><div class="hui_calendar_day"><xsl:comment/></div></td>
    </tr>
    </tbody>
  </table>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Calendar({
      element:'<xsl:value-of select="generate-id()"/>'
      ,name:'<xsl:value-of select="@name"/>'
      ,state:'<xsl:value-of select="@state"/>'
      <xsl:if test="@start-hour">,startHour:<xsl:value-of select="@start-hour"/></xsl:if>
      <xsl:if test="@end-hour">,endHour:<xsl:value-of select="@end-hour"/></xsl:if>
      <xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>






<!--doc title:'Picker' class:'hui.ui.Picker' module:'selection'
<picker name="«name»" shadow="«boolean»" title="«text»" item-height="«pixels»" item-width="«pixels»">
    <item title="«text»" value="«text»" image="«url»" />
    <item title="«text»" value="«text»" image="«url»" />
</picker>
-->
<xsl:template match="gui:picker">
  <div id="{generate-id()}">
    <xsl:attribute name="class">
      <xsl:text>hui_picker</xsl:text>
      <xsl:if test="@shadow='true'"><xsl:text> hui_picker_shadow</xsl:text></xsl:if>
    </xsl:attribute>
      <xsl:if test="@title">
        <div class="hui_picker_title"><xsl:value-of select="@title"/></div>
      </xsl:if>
    <div class="hui_picker_container"><div class="hui_picker_content"><xsl:comment/></div></div>
    <div class="hui_picker_pages"><a>1</a><a>2</a><a>3</a></div>
  </div>
  <script type="text/javascript">
    (function() {
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Picker({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
        <xsl:if test="@item-height">,itemHeight:<xsl:value-of select="@item-height"/></xsl:if>
        <xsl:if test="@item-width">,itemWidth:<xsl:value-of select="@item-width"/></xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
      var items = [];
      <xsl:for-each select="gui:item">
        items.push({
          title:'<xsl:value-of select="@title"/><xsl:value-of select="@text"/>' <!-- TODO title is deprecated -->
          ,image:'<xsl:value-of select="@image"/>'
          ,value:'<xsl:value-of select="@value"/>'
        });
      </xsl:for-each>
      <xsl:value-of select="generate-id()"/>_obj.setObjects(items);
    })();
  </script>
</xsl:template>





<!--doc title:'HTML' module:'layout'
<html xmlns="«'http://www.w3.org/1999/xhtml'»">
    ···
</html>
-->
<xsl:template match="html:html">
  <xsl:copy-of select="child::*|child::text()"/>
</xsl:template>

<xsl:template match="gui:html">
  <xsl:copy-of select="child::*|child::text()"/>
</xsl:template>

<xsl:template match="gui:div|gui:span|gui:strong|gui:p|gui:em|gui:a|gui:input|gui:h1|gui:h2|gui:h3|gui:h4|gui:h5|gui:h6">
  <xsl:element name="{name()}">
    <xsl:if test="@style">
      <xsl:attribute name="style"><xsl:value-of select="@style"/></xsl:attribute>
    </xsl:if>
    <xsl:if test="@class">
      <xsl:attribute name="class"><xsl:value-of select="@class"/></xsl:attribute>
    </xsl:if>
    <xsl:if test="@id">
      <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
    </xsl:if>
    <xsl:if test="@href">
      <xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute>
    </xsl:if>
    <xsl:if test="@onclick">
      <xsl:attribute name="onclick"><xsl:value-of select="@onclick"/></xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>







<!--doc title:'Text' module:'layout'
<text align="«'left' | 'center' | 'right'»" top="«pixels»" bottom="«pixels»">
    <h|header>···</h|header>
    <p>···</p>
    ···
</text>
-->
<xsl:template match="gui:text">
  <div class="hui_text">
    <xsl:attribute name="style">
      <xsl:if test="@align">text-align:<xsl:value-of select="@align"/>;</xsl:if>
      <xsl:if test="@top">padding-top:<xsl:value-of select="@top"/>px;</xsl:if>
      <xsl:if test="@bottom">padding-bottom:<xsl:value-of select="@bottom"/>px;</xsl:if>
    </xsl:attribute>
    <xsl:apply-templates/>
  </div>
</xsl:template>

<xsl:template match="gui:text/gui:header | gui:text/gui:h">
  <h1><xsl:apply-templates/></h1>
</xsl:template>

<xsl:template match="gui:text/gui:p">
  <p><xsl:apply-templates/></p>
</xsl:template>




<!--doc title:'Link' class:'hui.ui.Link' module:'action'
<link name="«name»">
    ····
</link>
-->
<xsl:template match="gui:link">
  <a href="javascript://" class="hui_link" id="{generate-id()}"><span><xsl:apply-templates/></span></a>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Link({
      element : '<xsl:value-of select="generate-id()"/>',
      name : '<xsl:value-of select="@name"/>'
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
</xsl:template>




  <!--doc title:'Diagram' class:'hui.ui.Diagram' module:'visalization'
  <diagram name="«name»"/>
  -->
  <xsl:template match="gui:diagram">
    <div class="hui_diagram" id="{generate-id()}">
      <xsl:attribute name="style">
        <xsl:choose>
        <xsl:when test="not(@height) or @height='full'">
          <xsl:text>height:100%;</xsl:text>
        </xsl:when>
        <xsl:when test="@height">
          <xsl:text>height:</xsl:text><xsl:value-of select="@height"/><xsl:text>px;</xsl:text>
        </xsl:when>
        </xsl:choose>
        <xsl:if test="@width">
          <xsl:text>width:</xsl:text><xsl:value-of select="@width"/><xsl:text>px;</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:comment/>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Diagram({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>'
        <xsl:if test="@source">
          ,source:<xsl:value-of select="@source"/>
        </xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>



  <!--doc title:'Chart' class:'hui.ui.Chart' module:'visalization'
  <chart name="«name»" source="«name»"/>
  -->
  <xsl:template match="gui:chart">
    <div class="hui_chart" id="{generate-id()}">
      <xsl:attribute name="style">
        <xsl:if test="@width">
          <xsl:text>width:</xsl:text><xsl:value-of select="@width"/><xsl:text>px;</xsl:text>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="@height='full'">
            <xsl:text>height: 100%;</xsl:text>
          </xsl:when>
          <xsl:when test="substring(@height, string-length(@height))='%'">
            <xsl:text>height:</xsl:text><xsl:value-of select="@height"/><xsl:text>;</xsl:text>
          </xsl:when>
          <xsl:when test="@height">
            <xsl:text>height:</xsl:text><xsl:value-of select="@height"/><xsl:text>px;</xsl:text>
          </xsl:when>
        </xsl:choose>
      </xsl:attribute>
      <xsl:comment/></div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Chart({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>'
        <xsl:if test="@source">
          ,source:<xsl:value-of select="@source"/>
        </xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>



  <!--doc title:'Segmented' class:'hui.ui.Segmented' module:'input'
  <segmented name="«name»" value="«text»" allow-null="«boolean»">
      <item text="«text»" value="«text»" icon="«icon»" />
  </segmented>
  -->
  <xsl:template match="gui:segmented" name="gui:segmented">
    <span id="{generate-id()}">
      <xsl:if test="@top">
        <xsl:attribute name="style">
          <xsl:text>margin-top: </xsl:text><xsl:value-of select="@top"/><xsl:text>px;</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">
        <xsl:text>hui_segmented</xsl:text>
        <xsl:if test="@variant">
          <xsl:text> hui_segmented_</xsl:text><xsl:value-of select="@variant"/>
        </xsl:if>
        <xsl:if test="not(@variant)">
          <xsl:text> hui_segmented_standard</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:for-each select="gui:item | gui:option"> <!-- TODO item is deprecated -->
        <a href="javascript:void(0)" rel="{@value}">
          <xsl:if test="@value=../@value">
            <xsl:attribute name="class">hui_segmented_selected</xsl:attribute>
          </xsl:if>
          <xsl:if test="@icon">
            <span class="hui_icon_16" style="background-image: url('{$context}/hui/icons/{@icon}16.png')"><xsl:comment/></span>
          </xsl:if>
          <xsl:if test="@title or @text">
            <span class="hui_segmented_text"><xsl:value-of select="@title"/><xsl:value-of select="@text"/></span>
          </xsl:if>
        </a>
      </xsl:for-each>
    <xsl:comment/></span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Segmented({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
        <xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
        <xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
        <xsl:if test="@allow-null='true'">,allowNull:true</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Rendering' class:'hui.ui.Rendering' module:'layout'
  <rendering name="«name»"/>
  -->
  <xsl:template match="gui:rendering">
    <div class="hui_rendering" id="{generate-id()}">
      <xsl:apply-templates/>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Rendering({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>

  </xsl:template>

  <!--doc title:'Menu' class:'hui.ui.Menu' module:'layout'
  <menu name="«name»">
      <item text="«text»" value="«text»"/>
      <divider>
      <item text="«text»" value="«text»">
        <item text="«text»" value="«text»"/>
    </item>
  </menu>
  -->
  <xsl:template match="gui:menu">
    <script type="text/javascript">
      (function() {
        var menu = <xsl:value-of select="generate-id()"/>_obj = hui.ui.Menu.create({name:'<xsl:value-of select="@name"/>'});
        var items = [];
        <xsl:apply-templates/>
        menu.addItems(items);
        <xsl:call-template name="gui:createobject"/>
      })();
    </script>

  </xsl:template>

  <xsl:template match="gui:menu//gui:item">
    items.push({text:'<xsl:value-of select="@text"/>',value:'<xsl:value-of select="@value"/>',children:(function() {
      var items = [];
      <xsl:apply-templates/>
      return items;
    })()});
  </xsl:template>

  <xsl:template match="gui:menu//gui:divider">
    items.push(null);
  </xsl:template>

  <xsl:template match="gui:keyboard-navigator">
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.KeyboardNavigator({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:finder">
      <script type="text/javascript">
          (function() {
          var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Finder({
          name : '<xsl:value-of select="@name"/>',
                  url : '<xsl:value-of select="@url"/>',
          title : '<xsl:value-of select="@title"/>',
          list : {url:'<xsl:value-of select="@list-url"/>'},
          selection : {
            url : '<xsl:value-of select="@selection-url"/>',
            value : '<xsl:value-of select="@selection-value"/>',
            parameter : '<xsl:value-of select="@selection-parameter"/>'
          },
          search : {parameter : '<xsl:value-of select="@search-parameter"/>'}
        });
        <xsl:call-template name="gui:createobject"/>
          })();
      </script>
  </xsl:template>

  <xsl:template match="gui:media-simulator">
    <div class="hui_mediasimulator" id="{generate-id()}">
      <div class="hui_mediasimulator_base">
        <div class="hui_mediasimulator_bar">
        </div>
        <div class="hui_mediasimulator_handle hui_mediasimulator_handle-right"><xsl:comment/></div>
        <div class="hui_mediasimulator_handle hui_mediasimulator_handle-bottom"><xsl:comment/></div>
        <div class="hui_mediasimulator_body">
          <iframe class="hui_mediasimulator_frame" src="{@url}"><xsl:comment/></iframe>
        </div>
      </div>
    </div>
    <script type="text/javascript">
      (function() {
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.MediaSimulator({
          element : '<xsl:value-of select="generate-id()"/>',
          name : '<xsl:value-of select="@name"/>'
        });
      <xsl:call-template name="gui:createobject"/>
      })();
    </script>
  </xsl:template>

  <xsl:template match="gui:managed">
    <xsl:apply-templates/>
    <script type="text/javascript">
      (function() {
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.EditManager({
        name : '<xsl:value-of select="@name"/>',
        root: '<xsl:value-of select="generate-id(gui:window)"/>',
        save: {url:'<xsl:value-of select="@save-url"/>'},
        read: {url:'<xsl:value-of select="@read-url"/>'},
        remove: {url:'<xsl:value-of select="@delete-url"/>'}
      });
      <xsl:call-template name="gui:createobject"/>
      })()
    </script>
  </xsl:template>

  <!--doc title:'Icon' class:'hui.ui.Icon' module:'action'
  <icon name="«text»" icon="«icon»" size="«pixels»" text="«text»"/>
  -->
  <xsl:template match="gui:icon">
    <span id="{generate-id()}">
      <xsl:attribute name="style">background-image: url('<xsl:value-of select="$context"/>/hui/icons/<xsl:value-of select="@icon"/><xsl:value-of select="@size"/>.png');</xsl:attribute>
      <xsl:attribute name="class">hui_icon_<xsl:value-of select="@size"/></xsl:attribute>
      <xsl:comment/>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Icon({
        element : '<xsl:value-of select="generate-id()"/>',
        icon : '<xsl:value-of select="@icon"/>',
        size : <xsl:value-of select="@size"/>
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>


  <xsl:template match="gui:icon[@text]">
    <a id="{generate-id()}" href="javascript://" class="hui_icon_labeled hui_icon_labeled_{@size}">
      <xsl:if test="@click">
        <xsl:attribute name="onclick"><xsl:value-of select="@click"/></xsl:attribute>
      </xsl:if>
      <span>
        <xsl:attribute name="style">background-image: url('<xsl:value-of select="$context"/>/hui/icons/<xsl:value-of select="@icon"/><xsl:value-of select="@size"/>.png');</xsl:attribute>
        <xsl:attribute name="class">hui_icon_<xsl:value-of select="@size"/></xsl:attribute>
        <xsl:comment/>
      </span>
      <strong><xsl:value-of select="@text"/></strong>
    </a>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Icon({
        element : '<xsl:value-of select="generate-id()"/>',
        icon : '<xsl:value-of select="@icon"/>',
        size : <xsl:value-of select="@size"/>
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Space' module:'layout'
  <space all="«pixels»" left="«pixels»" right="«pixels»" top="«pixels»" bottom="«pixels»" align="«left | center | right»" height="«pixels»" width="«pixels»">
      ···
  </space>
  -->
  <xsl:template match="gui:space">
    <div class="hui_space">
      <xsl:attribute name="style">
        <xsl:if test="@all">padding: <xsl:value-of select="@all"/>px;</xsl:if>
        <xsl:if test="@left">padding-left: <xsl:value-of select="@left"/>px;</xsl:if>
        <xsl:if test="@right">padding-right: <xsl:value-of select="@right"/>px;</xsl:if>
        <xsl:if test="@top">padding-top: <xsl:value-of select="@top"/>px;</xsl:if>
        <xsl:if test="@bottom">padding-bottom: <xsl:value-of select="@bottom"/>px;</xsl:if>
        <xsl:if test="@align">text-align: <xsl:value-of select="@align"/>;</xsl:if>
        <xsl:if test="@height">height: <xsl:value-of select="@height"/>px; font-size: 0px;</xsl:if>
      </xsl:attribute>
      <xsl:comment/>
      <xsl:apply-templates/>
    </div>
  </xsl:template>


  <xsl:template match="gui:space[@width]">
    <span style="display: inline-block; font-size: 0; width: 20px;"><xsl:comment/></span>
  </xsl:template>





  <!--doc title:'Columns' module:'layout'
  <columns space="«pixels»" flexible="«boolean»" height="«'full'»">
      <column width="«css-length»">
          ···
      </column>
      <column width="«css-length»">
      ···
      </column>
  </columns>
  -->

  <xsl:template match="gui:columns">
    <div class="hui_columns" id="{generate-id()}">
      <xsl:apply-templates/>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Columns({
        element : '<xsl:value-of select="generate-id()"/>',
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:columns/gui:column">
    <div class="hui_columns_column">
      <xsl:apply-templates/>
      <xsl:comment/>
    </div>
  </xsl:template>

  <xsl:template match="gui:columns[@flexible='true']">
    <table cellspacing="0" cellpadding="0">
      <xsl:attribute name="class">
        <xsl:text>hui_columns</xsl:text>
        <xsl:if test="@height='full'">
          <xsl:text> hui_columns_full</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <tr>
        <xsl:apply-templates select="gui:column"/>
      </tr>
    </table>
  </xsl:template>

  <xsl:template match="gui:columns[@flexible='true']/gui:column">
    <td class="hui_columns_column">
      <xsl:if test="(position()>1 and ../@space) or @width">
        <xsl:attribute name="style">
          <xsl:if test="position()>1 and ../@space">padding-left: <xsl:value-of select="../@space"/>px;</xsl:if>
          <xsl:if test="@width">width: <xsl:value-of select="@width"/>;</xsl:if>
        </xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </td>
  </xsl:template>


  <!--doc title:'Rows' module:'layout'
  <rows space="«pixels»" flexible="«boolean»" height="«'full'»">
      <column width="«css-length»">
          ···
      </column>
      <column width="«css-length»">
      ···
      </column>
  </row>
  -->
  <xsl:template match="gui:rows">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_rows</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates select="gui:row"/>
    </div>
    <script type="text/javascript">
      (function() {
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Rows({
          element : '<xsl:value-of select="generate-id()"/>',
          <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        });
        <xsl:call-template name="gui:createobject"/>
      })()
    </script>
  </xsl:template>

  <xsl:template match="gui:rows/gui:row">
    <div>
      <xsl:attribute name="class">
        <xsl:text>hui_rows_row</xsl:text>
        <xsl:if test="@size='adapt'">
          <xsl:text> hui_rows_row-adapt</xsl:text>
        </xsl:if>
        <xsl:if test="@size='min'">
          <xsl:text> hui_rows_row-min</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:attribute name="data">
        <xsl:text>{"min":"</xsl:text>
        <xsl:value-of select="@min"/>
        <xsl:text>","max":"</xsl:text>
        <xsl:value-of select="@max"/>
        <xsl:text>","height":"</xsl:text>
        <xsl:value-of select="@height"/>
        <xsl:text>"}</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
      <xsl:comment/>
    </div>
  </xsl:template>

  <!--doc title:'Header' module:'layout'
  <header icon="«icon»">«text»</header>
  -->
  <xsl:template match="gui:header">
    <h2 class="hui_header">
      <xsl:if test="@icon">
        <span class="hui_icon_2" style="background-image: url('{$context}/hui/icons/{@icon}32.png')">
          <xsl:comment/>
        </span>
      </xsl:if>
      <xsl:apply-templates/>
    </h2>
  </xsl:template>





  <!--doc title:'Overflow' class:'hui.ui.Overflow' module:'layout'
  <overflow background="«background»" vertical="«pixels»" height="«pixels»" min-height="«pixels»" max-height="«pixels»" state="«text»">
      ···
  </overflow>
  -->
  <xsl:template match="gui:overflow">
  <div id="{generate-id()}">
    <xsl:attribute name="class">
      <xsl:text>hui_overflow</xsl:text>
      <xsl:if test="@background">
        <xsl:text> hui_bg_</xsl:text><xsl:value-of select="@background"/>
      </xsl:if>
      <xsl:if test="@shadow-variant">
        <xsl:text> hui_overflow_shadow_</xsl:text><xsl:value-of select="@shadow-variant"/>
      </xsl:if>
    </xsl:attribute>
    <xsl:attribute name="style">
      <xsl:choose>
        <xsl:when test="@height or @max-height or @min-height or @full='true'">
          <xsl:choose>
            <xsl:when test="@full='true' or @height='full'">
              <xsl:text>height: 100%;</xsl:text>
            </xsl:when>
            <xsl:when test="@height">
              height: <xsl:value-of select="@height"/>px;
            </xsl:when>
          </xsl:choose>
          <xsl:if test="@max-height">max-height: <xsl:value-of select="@max-height"/>px;</xsl:if>
          <xsl:if test="@min-height">min-height: <xsl:value-of select="@min-height"/>px;</xsl:if>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>height: 0px;</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
        <xsl:text>display:none;</xsl:text>
      </xsl:if>
    </xsl:attribute>
    <div class="hui_overflow_top">
      <xsl:comment/></div>
    <xsl:apply-templates/>
    <div class="hui_overflow_bottom"><xsl:comment/></div>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Overflow({
      element : '<xsl:value-of select="generate-id()"/>',
      dynamic : <xsl:value-of select="not(@height or @max-height or @min-height or @vertical or @full='true')"/>
      <xsl:if test="@vertical">,vertical:<xsl:value-of select="@vertical"/></xsl:if>
      <xsl:if test="@state">,state:'<xsl:value-of select="@state"/>'</xsl:if>
      <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
  </xsl:template>




  <!--doc title:'Split' module:'layout'
  <split>
      <row>···</row>
      <row>···</row>
  </split>
  -->
  <xsl:template match="gui:split">
    <div class="hui_split" id="{generate-id()}">
      <xsl:apply-templates select="gui:row"/>
    </div>
    <script type="text/javascript">
      (function() {
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Split({
          element : '<xsl:value-of select="generate-id()"/>'
          <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        });
        <xsl:call-template name="gui:createobject"/>
      })()
    </script>
  </xsl:template>

  <xsl:template match="gui:split/gui:row">
    <div class="hui_split_row">
      <xsl:if test="@height">
        <xsl:attribute name="data-height">
          <xsl:value-of select="@height"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
      <xsl:comment/>
    </div>
  </xsl:template>



  <!--doc title:'Box' class:'hui.ui.Box' module:'layout'
  <box variant="«?»" closable="«boolean»" absolute="«boolean»" width="«pixels»" top="«pixels»" name="«name»" title="«text»" state="«text»" modal="«boolean»">
      <toolbar/>
      ···
  </box>
  -->
  <xsl:template match="gui:box">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_box</xsl:text>
        <xsl:if test="@variant"><xsl:text> hui_box_</xsl:text><xsl:value-of select="@variant"/></xsl:if>
        <xsl:if test="@absolute='true'"><xsl:text> hui_box_absolute</xsl:text></xsl:if>
      </xsl:attribute>
      <xsl:attribute name="style">
        <xsl:if test="@width">width: <xsl:value-of select="@width"/>px;</xsl:if>
        <xsl:if test="@top">margin-top: <xsl:value-of select="@top"/>px;</xsl:if>
      </xsl:attribute>
      <xsl:if test="@closable='true'"><a class="hui_box_close" href="javascript://"><xsl:comment/></a></xsl:if>
      <xsl:if test="@title or gui:toolbar">
        <div class="hui_box_header">
          <xsl:attribute name="class">hui_box_header<xsl:if test="gui:toolbar"> hui_box_header_toolbar</xsl:if></xsl:attribute>
          <xsl:apply-templates select="gui:toolbar"/>
          <strong class="hui_box_title"><xsl:value-of select="@title"/></strong>
        </div>
      </xsl:if>
      <div class="hui_box_body">
        <xsl:if test="@padding"><xsl:attribute name="style">padding: <xsl:value-of select="@padding"/>px;</xsl:attribute></xsl:if>
        <xsl:apply-templates select="child::*[not(name()='toolbar')]"/>
        <xsl:comment/>
      </div>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Box({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
        <xsl:if test="@modal='true'">,modal:true</xsl:if>
        <xsl:if test="@absolute='true'">,absolute:true</xsl:if>
        <xsl:if test="@state">,state:'<xsl:value-of select="@state"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Wizard' class:'hui.ui.Wizard' module:'layout'
  <wizard name="«name»">
      <step frame="«boolean»" icon="«icon»" title="«text»">
          ···
      </step>
  </wizard>
  -->
  <xsl:template match="gui:wizard">
    <div class="hui_wizard" id="{generate-id()}">
      <table class="hui_wizard"><tr>
        <th class="hui_wizard">
          <xsl:if test="@selection-width">
          </xsl:if>
          <ul class="hui_wizard">
            <xsl:attribute name="style">
              <xsl:text>width: </xsl:text>
              <xsl:value-of select="@selection-width"/>
              <xsl:text>px;</xsl:text>
            </xsl:attribute>
          <xsl:for-each select="gui:step">
            <li>
              <a href="javascript://">
                <xsl:attribute name="class">
                  <xsl:text>hui_wizard_selection</xsl:text>
                  <xsl:if test="position()=1">
                    <xsl:text> hui_selected</xsl:text>
                  </xsl:if>
                </xsl:attribute>
                <xsl:if test="@icon"><span class="hui_icon_16" style="background-image: url('{$context}/hui/icons/{@icon}16.png');')"><xsl:comment/></span></xsl:if>
                <span><xsl:value-of select="@title"/></span>
              </a>
            </li>
          </xsl:for-each>
          </ul>
        </th>
        <td class="hui_wizard">
          <div class="hui_wizard_steps">
          <xsl:for-each select="gui:step">
            <div>
              <xsl:attribute name="class">
                <xsl:text>hui_wizard_step</xsl:text>
                <xsl:if test="@frame='true'"><xsl:text> hui_wizard_step_frame</xsl:text></xsl:if>
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
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Wizard({
          element : '<xsl:value-of select="generate-id()"/>',
          name : '<xsl:value-of select="@name"/>'
        });
        <xsl:call-template name="gui:createobject"/>
      })();
    </script>
  </xsl:template>





  <!--doc title:'Layout' class:'hui.ui.Layout' module:'layout'
  <layout name="«name»">
      <top>
          ···
      </top>
      <middle>
          <left>
              ···
          </left>
          <center padding="«pixels»">
              ···
          </center>
      </middle>
      <bottom>
          ···
      </botttom>
  </layout>
  -->
  <xsl:template match="gui:layout">
    <table class="hui_layout" id="{generate-id()}">
      <xsl:apply-templates/>
    </table>
    <script type="text/javascript">
      (function() {
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Layout({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'});
        <xsl:call-template name="gui:createobject"/>
      })();
    </script>
  </xsl:template>

  <xsl:template match="gui:layout/gui:top">
    <thead class="hui_layout">
      <tr><td class="hui_layout_top">
        <div class="hui_layout_top"><div class="hui_layout_top"><div class="hui_layout_top">
          <xsl:apply-templates/>
          <xsl:comment/>
        </div></div></div>
      </td></tr>
    </thead>
  </xsl:template>

  <xsl:template match="gui:layout/gui:middle">
    <tbody class="hui_layout">
      <tr class="hui_layout_middle">
        <td class="hui_layout_middle">
        <table class="hui_layout_middle">
          <tr>
            <xsl:apply-templates/>
          </tr>
        </table>
      </td></tr>
    </tbody>
  </xsl:template>

  <xsl:template match="gui:layout/gui:middle/gui:left">
    <td class="hui_layout_left hui_context_sidebar">
      <xsl:apply-templates/>
      <div class="hui_layout_left"><xsl:comment/></div>
    </td>
  </xsl:template>

  <xsl:template match="gui:layout/gui:middle/gui:center">
    <td class="hui_layout_center">
      <xsl:if test="@padding">
        <xsl:attribute name="style">padding: <xsl:value-of select="@padding"/>px;</xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </td>
  </xsl:template>

  <xsl:template match="gui:layout/gui:bottom">
    <tfoot class="hui_layout">
      <tr><td class="hui_layout_bottom">
        <div class="hui_layout_bottom"><div class="hui_layout_bottom"><div class="hui_layout_bottom">
          <xsl:apply-templates/>
        </div></div></div>
      </td></tr>
    </tfoot>
  </xsl:template>




  <!--doc title:'Fragment' class:'hui.ui.Fragment' module:'layout'
  <fragment name="«name»" state="«text»" height="«'full'»" background="«background»" visible="«boolean»">
      ···
  </fragment>
  -->
  <xsl:template match="gui:fragment">
  <div id="{generate-id()}">
    <xsl:attribute name="style">
      <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state) or @visible='false'">
        <xsl:text>display:none;</xsl:text>
      </xsl:if>
      <xsl:if test="@height='full'">
        <xsl:text>min-height: 100%;</xsl:text>
      </xsl:if>
    </xsl:attribute>
    <xsl:if test="@background">
      <xsl:attribute name="class">hui_bg_<xsl:value-of select="@background"/></xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
    <xsl:comment/>
  </div>
  <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Fragment({
      element:'<xsl:value-of select="generate-id()"/>',
      name:'<xsl:value-of select="@name"/>',
      state:'<xsl:value-of select="@state"/>'
    });
    <xsl:call-template name="gui:createobject"/>
  </script>
  </xsl:template>




  <!--doc title:'Pages' class:'hui.ui.Pages' module:'layout'
  <pages name="«name»" height="«'full'»">
      <page>
          ···
      </page>
      <page>
          ···
      </page>
  </pages>
  -->
  <xsl:template match="gui:pages">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_pages</xsl:text>
        <xsl:if test="@height='full'">
          <xsl:text> hui_pages_full</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:for-each select="gui:page">
        <div class="hui_pages_page">
          <xsl:attribute name="class">
            <xsl:text>hui_pages_page</xsl:text>
            <xsl:if test="@background">
              <xsl:text> hui_bg_</xsl:text><xsl:value-of select="@background"/>
            </xsl:if>
          </xsl:attribute>
          <xsl:if test="@key">
            <xsl:attribute name="data-key"><xsl:value-of select="@key"/></xsl:attribute>
          </xsl:if>
          <xsl:if test="position()>1">
            <xsl:attribute name="style">display:none;</xsl:attribute>
          </xsl:if>
          <xsl:apply-templates/>
          <xsl:comment/>
        </div>
      </xsl:for-each>
      <xsl:apply-templates/>
    </div>
    <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Pages({
      element : '<xsl:value-of select="generate-id()"/>'
      <xsl:if test="@name">,name : '<xsl:value-of select="@name"/>'</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:pages/gui:page">
  </xsl:template>





  <!--doc title:'Tiles' class:'hui.ui.Tiles' module:'layout'
  <tiles name="«name»" reveal="«boolean»">
      <tile width="«percent»" height="«percent»" left="«percent»" top="«percent»" padding="«pixels»" background="«css-color»" variant="«'light'»">
          <title>«text»</title>
          <actions>
              <icon icon="«icon»" key="«text»"/>
              <icon icon="«icon»" key="«text»"/>
          </actions>
          ···
      </tile>
  </pages>
  -->
  <xsl:template match="gui:tiles">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_tiles</xsl:text>
        <xsl:if test="@reveal='true'">
          <xsl:text> hui_tiles_revealing</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:apply-templates/>
    </div>
    <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Tiles({
      element : '<xsl:value-of select="generate-id()"/>'
      <xsl:if test="@name">,name : '<xsl:value-of select="@name"/>'</xsl:if>
      <xsl:if test="@reveal='true'">,reveal : true</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:tiles/gui:tile">
    <div class="hui_tile" id="{generate-id()}">
      <xsl:attribute name="style">
        width: <xsl:value-of select="@width"/>%;
        height: <xsl:value-of select="@height"/>%;
        left: <xsl:value-of select="@left"/>%;
        top: <xsl:value-of select="@top"/>%;
        padding: <xsl:value-of select="../@space div 2"/>px;
      </xsl:attribute>
      <div>
        <xsl:attribute name="class">
          <xsl:text>hui_tile_body</xsl:text>
          <xsl:if test="@background">
            <xsl:text> hui_tile_color</xsl:text>
          </xsl:if>
          <xsl:if test="@variant">
            <xsl:text> hui_tile_</xsl:text><xsl:value-of select="@variant"/>
          </xsl:if>
        </xsl:attribute>
        <xsl:if test="@background">
          <xsl:attribute name="style">
            background-color: <xsl:value-of select="@background"/>;
          </xsl:attribute>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="gui:title">
            <div class="hui_tile_title">
              <xsl:value-of select="gui:title"/>
            </div>
            <div class="hui_tile_content">
              <xsl:apply-templates/>
            </div>
          </xsl:when>
          <xsl:otherwise>
            <xsl:apply-templates/>
          </xsl:otherwise>
        </xsl:choose>
      </div>
    </div>
    <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Tile({
      element : '<xsl:value-of select="generate-id()"/>'
      <xsl:if test="@name">,name : '<xsl:value-of select="@name"/>'</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:tile/gui:title">
  </xsl:template>

  <xsl:template match="gui:tile/gui:actions">
    <div class="hui_tile_actions">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="gui:tile/gui:actions/gui:icon">
    <a class="hui_icon_16 hui_tile_icon" style="background-image: url('{$context}/hui/icons/{@icon}16.png')">
      <xsl:if test="@key">
        <xsl:attribute name="data-hui-key">
          <xsl:value-of select="@key"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:comment/>
    </a>
  </xsl:template>





  <!--doc title:'Structure' class:'hui.ui.Structure' module:'layout'
  <structure name="«name»" height="«pixels»">
      <top>
          ···
      </top>
      <middle>
          <left>
              ···
          </left>
          <center>
              ···
          </center>
          <right>
              ···
          </right>
      </middle>
      <bottom>
          ···
      </bottom>
  </structure>
  -->
  <xsl:template match="gui:structure">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_structure</xsl:text>
        <xsl:if test="not(@height)">
          <xsl:text> hui_structure_full</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:if test="@height"><xsl:attribute name="style">height:<xsl:value-of select="@height"/>px;</xsl:attribute></xsl:if>

      <xsl:apply-templates/>
    </div>
    <script type="text/javascript">
    var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Structure({
      element : '<xsl:value-of select="generate-id()"/>'
      <xsl:if test="@name">,name : '<xsl:value-of select="@name"/>'</xsl:if>
    });
    <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:structure/gui:top">
    <div class="hui_structure_top">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="gui:structure/gui:middle">
    <div class="hui_structure_middle">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="gui:structure/gui:middle/gui:left">
    <div class="hui_structure_left hui_context_sidebar">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="gui:structure/gui:middle/gui:center">
    <div class="hui_structure_center">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="gui:structure/gui:middle/gui:right">
    <div class="hui_structure_right">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="gui:structure/gui:bottom">
    <div class="hui_structure_bottom">
      <xsl:apply-templates/>
    </div>
  </xsl:template>


  <!--doc title:'Skeleton' class:'hui.ui.Skeleton' module:'layout'
  -->

  <xsl:template match="gui:skeleton">
    <div class="hui_skeleton" id="{generate-id()}">
      <div class="hui_skeleton_navigation hui_context_sidebar">
        <div class="hui_skeleton_resize hui_skeleton_resize_navigation"></div>
        <xsl:apply-templates select="gui:navigation"/>
      </div>
      <div class="hui_skeleton_results">
        <div class="hui_skeleton_resize hui_skeleton_resize_results"></div>
        <xsl:apply-templates select="gui:results"/>
      </div>
      <div class="hui_skeleton_actions">
        <xsl:apply-templates select="gui:actions"/>
      </div>
      <div class="hui_skeleton_content">
        <xsl:apply-templates select="gui:content"/>
      </div>
    </div>
    <script type="text/javascript">
      (function() {
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Skeleton({
          element : '<xsl:value-of select="generate-id()"/>'
          <xsl:if test="@name">,name : '<xsl:value-of select="@name"/>'</xsl:if>
        });
        <xsl:call-template name="gui:createobject"/>
      })()
    </script>
  </xsl:template>

  <xsl:template match="gui:links">
    <div class="hui_links" id="{generate-id()}">
      <div class="hui_links_list"><xsl:comment/></div>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Links({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
        <xsl:if test="@pageSource">,pageSource:<xsl:value-of select="@pageSource"/></xsl:if>
        <xsl:if test="@page-source">,pageSource:<xsl:value-of select="@page-source"/></xsl:if>
        <xsl:if test="@fileSource">,fileSource:<xsl:value-of select="@fileSource"/></xsl:if>
        <xsl:if test="@file-source">,fileSource:<xsl:value-of select="@file-source"/></xsl:if>
        });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <!--                  Toolbar                   -->

  <!--doc title:'Toolbar' class:'hui.ui.Toolbar' module:'bar'
  <toolbar name="«name»" variant="«?»" border="«'top' | 'bottom'»" labels="«boolean»">
      ···
      <right>
          ···
      </right>
  </toolbar>
  -->
  <xsl:template match="gui:toolbar" name="gui:toolbar">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_toolbar</xsl:text>
        <xsl:if test="@border='top'"><xsl:text> hui_toolbar-border-top</xsl:text></xsl:if>
        <xsl:if test="@border='bottom'"><xsl:text> hui_toolbar-border-bottom</xsl:text></xsl:if>
        <xsl:if test="@centered='true'"><xsl:text> hui_toolbar-centered</xsl:text></xsl:if>
        <xsl:if test="ancestor::gui:window"><xsl:text> hui_toolbar-window</xsl:text></xsl:if>
        <xsl:if test="@variant"><xsl:text> hui_toolbar-</xsl:text><xsl:value-of select="@variant"/></xsl:if>
      </xsl:attribute>
      <xsl:if test="@left">
        <xsl:attribute name="style">
          <xsl:text>padding-left: </xsl:text><xsl:value-of select="@left"/><xsl:text>px;</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:apply-templates select="child::*[not(name()='right')]"/>
      <xsl:apply-templates select="gui:right"/>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Toolbar({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>


  <xsl:template match="gui:toolbar/gui:right">
    <div class="hui_toolbar_right"><xsl:apply-templates /></div>
  </xsl:template>

  <xsl:template match="gui:toolbar//gui:divider">
    <span class="hui_toolbar_divider"><xsl:comment /></span>
  </xsl:template>

  <xsl:template match="gui:toolbar//gui:more">
    <span class="hui_toolbar_more" id="{generate-id()}">
      <span class="hui_toolbar_more_content">
        <xsl:apply-templates/>
        <xsl:comment/>
      </span>
      <xsl:if test="@text">
        <a class="hui_toolbar_more_toggle"><xsl:value-of select="@text"/></a>
      </xsl:if>
      <xsl:if test="not(@text)">
        <a class="hui_toolbar_more_toggle">···</a>
      </xsl:if>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Toolbar.More({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <!--doc title:'Toolbar icon' class:'hui.ui.Toolbar.Icon' module:'bar'
  <toolbar···>
      ···
      <icon name="«name»" icon="«icon»" overlay="«overlay»" text="«text»" selected="«boolean»" disabled="«boolean»" click="«script»">
          <confirm text="«text»" ok="«text»" cancel="«text»"/>
      </icon>
      ···
  </toolbar>
  -->
  <xsl:template match="gui:toolbar//gui:icon">
    <a id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_toolbar_icon</xsl:text>
        <xsl:if test="@selected='true'"> hui_toolbar_icon_selected</xsl:if>
        <xsl:if test="@disabled='true'"> hui_toolbar_icon_disabled</xsl:if>
      </xsl:attribute>
      <span class="hui_icon" style="background-image: url('{$context}/hui/icons/{@icon}32.png'); background-image: -webkit-image-set(url('{$context}/hui/icons/{@icon}32.png') 1x, url('{$context}/hui/icons/{@icon}32x2.png') 2x);">
        <xsl:if test="@overlay">
          <span class="hui_icon_overlay" style="background-image: url('{$context}/hui/icons/overlay/{@overlay}32.png')"><xsl:comment/></span>
        </xsl:if>
        <xsl:if test="@badge!=''">
          <span class="hui_icon_badge"><xsl:value-of select="@badge"/></span>
        </xsl:if>
        <xsl:comment/>
      </span>
      <span class="hui_toolbar_icon_text"><xsl:value-of select="@title"/><xsl:value-of select="@text"/></span>
    </a>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Toolbar.Icon({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>'
        <xsl:if test="@key">
          ,key : '<xsl:value-of select="@key"/>'
        </xsl:if>
        <xsl:if test="gui:confirm">
          ,confirm:{text:'<xsl:value-of select="gui:confirm/@text"/>',okText:'<xsl:value-of select="gui:confirm/@ok"/>',cancelText:'<xsl:value-of select="gui:confirm/@cancel"/>'}
        </xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
      <xsl:if test="@click">
        <xsl:value-of select="generate-id()"/>_obj.listen({$click:function() {<xsl:value-of select="@click"/>}});
      </xsl:if>
    </script>
  </xsl:template>

  <!--doc title:'Search field' class:'hui.ui.SearchField' module:'input'
  <searchfield name="«text»" adaptive="«true»" width="«pixels»" expanded-width="«pixels»"/>
  -->
  <xsl:template match="gui:searchfield" name="gui:searchfield">
    <span id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_searchfield</xsl:text>
        <xsl:if test="@adaptive='true'">
          <xsl:text> hui_searchfield-adaptive</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:if test="@width">
        <xsl:attribute name="style">width:<xsl:value-of select="@width"/>px;</xsl:attribute>
      </xsl:if>
      <span class="hui_searchfield_placeholder"><xsl:value-of select="@placeholder"/><xsl:comment/></span>
      <a class="hui_searchfield_reset"><xsl:comment/></a>
      <input class="hui_searchfield_input" type="text"/>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.SearchField({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
        <xsl:if test="@expanded-width">,expandedWidth:<xsl:value-of select="@expanded-width"/></xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>


  <!--doc title:'Toolbar field' module:'bar'
  <toolbar···>
      ···
      <field label="«text»">
          ···
      </field>
      ···
  </toolbar>
  -->
  <xsl:template match="gui:toolbar//gui:field | gui:toolbar//gui:item">
    <span class="hui_toolbar_item">
      <span class="hui_toolbar_item_body"><xsl:apply-templates/></span>
      <span class="hui_toolbar_label"><xsl:value-of select="@label"/></span>
    </span>
  </xsl:template>





  <!--doc title:'Toolbar grid' module:'bar'
  <toolbar···>
      ···
      <grid>
          <row>
              <cell width="«pixels»" left="«pixels»" right="«pixels»">
                  ···
              </cell>
              <cell···><label>«text»</label></cell>
          </row>
          <row>
              <cell···>
              </cell>
          </row>
      </grid>
      ···
  </toolbar>
  -->
  <xsl:template match="gui:toolbar//gui:grid">
    <table class="hui_toolbar_grid">
      <xsl:if test="@left or @right">
      <xsl:attribute name="style">
        <xsl:if test="@left">
          margin-left:<xsl:value-of select="@left"/>px;
        </xsl:if>
        <xsl:if test="@right">
          margin-right:<xsl:value-of select="@right"/>px;
        </xsl:if>
      </xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </table>
  </xsl:template>

  <xsl:template match="gui:toolbar//gui:grid/gui:row">
    <tr>
      <xsl:apply-templates/>
    </tr>
  </xsl:template>

  <xsl:template match="gui:toolbar//gui:grid/gui:row/gui:cell">
    <xsl:if test="@label">
      <th class="hui_toolbar_grid_label"><xsl:value-of select="@label"/></th>
    </xsl:if>
    <td class="hui_toolbar_grid_cell">
      <xsl:attribute name="style">
        <xsl:if test="@width">width:<xsl:value-of select="@width"/>px;</xsl:if>
        <xsl:if test="@left">padding-left:<xsl:value-of select="@left"/>px;</xsl:if>
        <xsl:if test="@right">padding-right:<xsl:value-of select="@right"/>px;</xsl:if>
      </xsl:attribute>
      <xsl:apply-templates/>
    </td>
  </xsl:template>

  <xsl:template match="gui:toolbar//gui:grid/gui:row/gui:cell/gui:label">
    <label class="hui_toolbar_grid_label"><xsl:apply-templates/></label>
  </xsl:template>








  <!--doc title:'Bar' class:'hui.ui.Bar' module:'bar'
  <bar name="«text»" state="«text»">
      ···
      <right>
          ···
      </right>
  </bar>
  -->
  <xsl:template match="gui:bar">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_bar</xsl:text>
        <xsl:if test="@variant">
          <xsl:text> hui_bar_</xsl:text><xsl:value-of select="@variant"/>
        </xsl:if>
      </xsl:attribute>
      <xsl:if test="(@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)) or @visible='false'">
        <xsl:attribute name="style">display:none;</xsl:attribute>
      </xsl:if>
      <div class="hui_bar_body">
        <xsl:apply-templates select="gui:right"/>
        <div class="hui_bar_left">
          <xsl:apply-templates select="child::*[not(name()='right')]"/>
          <xsl:comment/>
        </div>
      </div>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Bar({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
        <xsl:if test="@state">,state : '<xsl:value-of select="@state"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:bar/gui:right">
    <div class="hui_bar_right">
      <xsl:apply-templates/>
      <xsl:comment/>
    </div>
  </xsl:template>




  <!--doc title:'Bar button' class:'hui.ui.Bar.Button' module:'bar'
  <bar···>
      <button name="«text»" icon="«icon»" text="«text»" selected="«boolean»" click="«script»"/>
  </bar>
  -->
  <xsl:template match="gui:bar//gui:button[@icon]">
    <xsl:variable name="class">
      <xsl:text>hui_bar_button</xsl:text>
      <xsl:if test="@selected='true'"><xsl:text> hui_bar_button_selected</xsl:text></xsl:if>
    </xsl:variable>
    <a id="{generate-id()}" class="{$class}">
      <xsl:if test="@icon">
        <span class="hui_icon_16" style="background-image: url('{$context}/hui/icons/{@icon}16.png')"><xsl:comment/></span>
      </xsl:if>
      <xsl:if test="@text">
        <span class="hui_bar_button_text"><xsl:value-of select="@text"/></span>
      </xsl:if>
    </a>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Bar.Button({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>'
        <xsl:if test="@key">,key : '<xsl:value-of select="@key"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
      <xsl:if test="@click">
        <xsl:value-of select="generate-id()"/>_obj.listen({$click:function() {<xsl:value-of select="@click"/>}});
      </xsl:if>
    </script>
  </xsl:template>




  <!--doc title:'Bar text' class:'hui.ui.Bar.Text' module:'bar'
  <bar···>
      <text name="«text»" text="«text»" variant="«?»"/>
  </bar>
  -->
  <xsl:template match="gui:bar//gui:text">
    <span class="hui_bar_text" id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_bar_text</xsl:text>
        <xsl:if test="@variant">
          <xsl:text> hui_bar_text_</xsl:text><xsl:value-of select="@variant"/>
        </xsl:if>
      </xsl:attribute>
      <xsl:value-of select="@text"/>
      <xsl:comment/>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Bar.Text({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>




  <!--doc title:'Bar space' module:'bar'
  <bar | toolbar···>
      <space width="«pixels»"/>
  </bar | toolbar>
  -->
  <xsl:template match="gui:bar//gui:space | gui:toolbar//gui:space">
    <span class="hui_bar_space">
      <xsl:if test="@width">
        <xsl:attribute name="style">width:<xsl:value-of select="@width"/>px;</xsl:attribute>
      </xsl:if>
      <xsl:comment/>
    </span>
  </xsl:template>

  <!--doc title:'Graph' class:'hui.ui.Graph' module:'visalization'
  <graph name="«name»" layout="«?»" source="«source»"/>
  -->
  <xsl:template match="gui:graph">
    <div class="hui_graph" id="{generate-id()}">
      <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
        <xsl:attribute name="style">display:none</xsl:attribute>
      </xsl:if>
      <xsl:comment/></div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Graph({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>',
        layout : '<xsl:value-of select="@layout"/>',
        state : '<xsl:value-of select="@state"/>'
        <xsl:if test="@source">,source : <xsl:value-of select="@source"/></xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <!--doc title:'TimeLine' class:'hui.ui.Graph' module:'visalization'
  <graph name="«name»" layout="«?»" source="«source»"/>
  -->
  <xsl:template match="gui:timeline">
    <div class="hui_timeline" id="{generate-id()}">
      <xsl:comment/>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.TimeLine({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>'
        <xsl:if test="@source">,source : <xsl:value-of select="@source"/></xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <!--doc title:'DatePicker' class:'hui.ui.DatePicker' module:'input'
  <datepicker name="«name»"/>
  -->
  <xsl:template match="gui:datepicker">

    <div class="hui_datepicker" id="{generate-id()}">
      <div class="hui_datepicker_header">
        <a class="hui_datepicker_next"></a>
        <a class="hui_datepicker_previous"></a>
        <strong>Juni 2015</strong>
      </div>
      <table>
        <thead><tr><th>Søn</th><th>Man</th><th>Tir</th><th>Ons</th><th>Tor</th><th>Fre</th><th>Lør</th></tr></thead>
        <tbody>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
    </div>
    <script type="text/javascript">
      (function() {
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.DatePicker({
          element : '<xsl:value-of select="generate-id()"/>',
          name : '<xsl:value-of select="@name"/>'
        });
        <xsl:call-template name="gui:createobject"/>
      })()
    </script>

  </xsl:template>

  <!--doc title:'Formula' class:'hui.ui.Formula' module:'input'
  <formula name="«name»" state="«text»" padding="«pixels»">
      <fields···>
          ···
      </fields>
  </formula>
  -->
  <xsl:template match="gui:formula">
    <form class="hui_formula hui_formula" id="{generate-id()}">
      <xsl:attribute name="style">
        <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
          <xsl:text>display:none;</xsl:text>
        </xsl:if>
        <xsl:if test="@padding">padding: <xsl:value-of select="@padding"/>px;</xsl:if>
      </xsl:attribute>
      <xsl:apply-templates/>
    </form>
    <script type="text/javascript">
      (function() {
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Formula({
          element:'<xsl:value-of select="generate-id()"/>',
          name:'<xsl:value-of select="@name"/>'
          <xsl:if test="@state">
            ,state:'<xsl:value-of select="@state"/>'
          </xsl:if>
        });
        <xsl:call-template name="gui:createobject"/>
      }());
    </script>
  </xsl:template>

  <xsl:template match="gui:formula//gui:header">
    <div class="hui_formula_header"><xsl:apply-templates/></div>
  </xsl:template>

  <!--doc title:'Fields' module:'input'
  <fields labels="«'above' | 'besides'»">
      ···
  </fields>
  -->
  <xsl:template match="gui:fields[not(@labels='above')]">
    <table class="hui_formula_fields">
      <xsl:apply-templates/>
    </table>
  </xsl:template>

  <!--doc title:'Fieldset' module:'input'
  <fieldset legend="«text»">
      ···
  </fieldset>
  -->
  <xsl:template match="gui:fieldset">
    <div class="hui_formula_fieldset">
      <xsl:if test="@top">
        <xsl:attribute name="style">margin-top: <xsl:value-of select="@top"/>px;</xsl:attribute>
      </xsl:if>
      <strong class="hui_formula_fieldset"><xsl:value-of select="@legend"/></strong>
      <xsl:apply-templates/>
    </div>
  </xsl:template>



  <!--doc title:'Field' module:'input'
  <group>
      <field label="«text»" hint="«text»">
          ···
      </field>
  </group>
  -->
  <xsl:template match="gui:fields/gui:field">
    <tr>
        <xsl:attribute name="style">
          <xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state) or @visible='false'">
            <xsl:text>display:none;</xsl:text>
          </xsl:if>
        </xsl:attribute>
          <xsl:if test="@name">
              <xsl:attribute name="id">
                  <xsl:value-of select="generate-id()"/>
              </xsl:attribute>
          </xsl:if>
      <th>
        <xsl:if test="gui:text-input[not(@multiline='true') and not(@breaks='true')] | gui:dropdown | gui:checkbox | gui:datetime-input | gui:style-length-input | gui:number-input | gui:radiobuttons">
          <xsl:attribute name="class">hui_formula_middle</xsl:attribute>
        </xsl:if>
        <label class="hui_formula_field"><xsl:value-of select="@label"/></label>
      </th>
      <td class="hui_formula_field">
        <div class="hui_formula_field_body"><xsl:apply-templates/></div>
        <xsl:if test="@hint"><p class="hui_formula_field_hint"><xsl:value-of select="@hint"/></p></xsl:if>
      </td>
    </tr>
      <xsl:if test="@name">
        <script type="text/javascript">
          (function() {
            var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Formula.Field({
              element:'<xsl:value-of select="generate-id()"/>',
              name:'<xsl:value-of select="@name"/>'
              <xsl:if test="@state">
                ,state:'<xsl:value-of select="@state"/>'
              </xsl:if>
            });
            <xsl:call-template name="gui:createobject"/>
          }());
        </script>
      </xsl:if>
  </xsl:template>

  <xsl:template match="gui:fields[@labels='above']/gui:field">
    <xsl:call-template name="gui:field"/>
  </xsl:template>

  <xsl:template match="gui:field" name="gui:field">
    <div>
      <xsl:attribute name="class">
        <xsl:text>hui_formula_field</xsl:text>
        <xsl:if test="@compact='true'">
          <xsl:text> hui_formula_field_compact</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:if test="@label">
        <label class="hui_formula_field"><xsl:value-of select="@label"/></label>
      </xsl:if>
      <div class="hui_formula_field_body"><xsl:apply-templates/></div>
      <xsl:if test="@hint"><p class="hui_formula_field_hint"><xsl:value-of select="@hint"/></p></xsl:if>
    </div>
  </xsl:template>






  <!--doc title:'Text input' class:'hui.ui.TextField' module:'input'
  <text-input name="«name»" multiline="«boolean»" value="«text»"/>
  -->
  <xsl:template name="gui:text" match="gui:textfield | gui:text-input">
    <xsl:choose>
      <xsl:when test="@lines>1 or @multiline='true' or @breaks='true'">
        <xsl:text disable-output-escaping='yes'>
        <![CDATA[<textarea class="hui_textinput"]]></xsl:text>
          <xsl:text> id="</xsl:text><xsl:value-of select="generate-id()"/><xsl:text>"</xsl:text>
          <xsl:if test="@placeholder!=''">
            <xsl:text> placeholder="</xsl:text><xsl:value-of select="@placeholder"/><xsl:text>"</xsl:text>
          </xsl:if>
          <xsl:text disable-output-escaping='yes'><![CDATA[>]]></xsl:text><xsl:value-of select="@value"/><xsl:text disable-output-escaping='yes'><![CDATA[</textarea>]]>
        </xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <input value="{@value}" id="{generate-id()}">
          <xsl:attribute name="class">
            <xsl:text>hui_textinput</xsl:text>
            <xsl:if test="@size='small' or ancestor::gui:cell"> hui_is_small</xsl:if>
          </xsl:attribute>
          <xsl:if test="@width">
            <xsl:attribute name="style">width: <xsl:value-of select="@width"/>px;</xsl:attribute>
          </xsl:if>
          <xsl:if test="@secret='true'"><xsl:attribute name="type">password</xsl:attribute></xsl:if>
          <xsl:if test="@placeholder!=''">
            <xsl:attribute name="placeholder"><xsl:value-of select="@placeholder"/></xsl:attribute>
          </xsl:if>
          <xsl:if test="@correction='false'">
            <xsl:attribute name="autocapitalize">off</xsl:attribute>
            <xsl:attribute name="autocorrect">off</xsl:attribute>
          </xsl:if>
        </input>
      </xsl:otherwise>
    </xsl:choose>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.TextField({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>',
        key : '<xsl:value-of select="@key"/>'
        <xsl:if test="@animate-value-change='false'">
        ,animateValueChange : <xsl:value-of select="@animate-value-change"/>
        </xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>






  <!--doc title:'Date-time input' module:'input'
  <datetime-input name="«text»" key="«text»" return-type="«'date' | 'seconds'»"/>
  -->
  <xsl:template name="gui:datetime" match="gui:datetime-input">
    <span class="hui_datetime" id="{generate-id()}">
      <input type="text" class="hui_textinput"/>
      <a class="hui_datetime_selector" href="javascript://" tabindex="-1"><xsl:comment/></a>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.DateTimeField({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>',
        key:'<xsl:value-of select="@key"/>',
        returnType:'<xsl:value-of select="@return-type"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Number input' module:'input'
  <number-input name="«text»" key="«text»" adaptive="«boolean»" min="«number»" max="«number»" decimals="«integer»" value="«number»" allow-null="«boolean»" tick-size="«number»"/>
  -->
  <xsl:template name="gui:number" match="gui:number-input">
    <span id="{generate-id()}">
      <xsl:if test="@width">
        <xsl:attribute name="style">width:<xsl:value-of select="@width"/>px;</xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">
        <xsl:text>hui_numberinput</xsl:text>
        <xsl:if test="@adaptive='true'"><xsl:text> hui_numberinput-adaptive</xsl:text></xsl:if>
        <xsl:if test="@size='small' or ancestor::gui:cell"><xsl:text> hui_is_small</xsl:text></xsl:if>
      </xsl:attribute>
      <input type="text" value="{@value}">
        <xsl:attribute name="class">
          <xsl:text>hui_textinput</xsl:text>
          <xsl:if test="@size='small' or ancestor::gui:cell"><xsl:text> hui_is_small</xsl:text></xsl:if>
        </xsl:attribute>
      </input>
      <span class="hui_numberinput_units"><xsl:comment/></span>
      <a class="hui_numberinput_up"><xsl:comment/></a>
      <a class="hui_numberinput_down"><xsl:comment/></a>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.NumberField({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>',
        key:'<xsl:value-of select="@key"/>'
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        <xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
        <xsl:if test="@min">,min:<xsl:value-of select="@min"/></xsl:if>
        <xsl:if test="@max">,max:<xsl:value-of select="@max"/></xsl:if>
        <xsl:if test="@decimals">,decimals:<xsl:value-of select="@decimals"/></xsl:if>
        <xsl:if test="@allow-null">,allowNull:true</xsl:if>
        <xsl:if test="@value">,value : '<xsl:value-of select="@value"/>'</xsl:if>
        <xsl:if test="@tick-size">,tickSize : <xsl:value-of select="@tick-size"/></xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'CSS length input' class:'hui.ui.StyleLength' module:'input'
  <style-length-input name="«text»" key="«text»" value="«css-length»"/>
  -->
  <xsl:template name="gui:style-length" match="gui:style-length-input">
    <span id="{generate-id()}">
      <xsl:if test="@width">
        <xsl:attribute name="style">width:<xsl:value-of select="@width"/>px;</xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">
        <xsl:text>hui_style_length hui_numberinput</xsl:text>
        <xsl:if test="@size='small' or ancestor::gui:cell"> hui_is_small</xsl:if>
      </xsl:attribute>
      <input type="text" value="{@value}">
        <xsl:attribute name="class">
          <xsl:text>hui_textinput</xsl:text>
          <xsl:if test="@size='small' or ancestor::gui:cell"> hui_is_small</xsl:if>
        </xsl:attribute>
      </input>
      <a class="hui_numberinput_up"><xsl:comment/></a>
      <a class="hui_numberinput_down"><xsl:comment/></a>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.StyleLength({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>',
        key:'<xsl:value-of select="@key"/>'
        <xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Color input' class:'hui.ui.ColorInput' module:'input'
  <color-input name="«text»" key="«text»" value="«css-color»"/>
  -->
  <xsl:template match="gui:color-input">
    <span class="hui_colorinput" id="{generate-id()}">
      <input class="hui_textinput" type="text" value="{@value}"/>
      <a class="hui_colorinput_color" href="javascript://" tabindex="-1"><xsl:comment/></a>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.ColorInput({
        element:'<xsl:value-of select="generate-id()"/>'
        <xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        <xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Object input' class:'hui.ui.ObjectInput' module:'input'
  <object-input name="«text»" key="«text»"/>
  -->
  <xsl:template match="gui:object-input">
    <div class="hui_objectinput" id="{generate-id()}">
      <div class="hui_objectinput_list">
        <span class="hui_objectinput_text">No value</span>
      </div>
      <a class="hui_button hui_button_small hui_objectinput_choose" href="javascript://">Select...</a>
      <a class="hui_button hui_is_disabled hui_button_small hui_objectinput_remove" href="javascript://">Remove</a>
      <xsl:comment/>
    </div>

    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.ObjectInput({
        element:'<xsl:value-of select="generate-id()"/>'
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        <xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
        <xsl:if test="gui:finder">
          ,finder : {
            url : '<xsl:value-of select="gui:finder/@url"/>',
            title : '<xsl:value-of select="gui:finder/@title"/>',
            list : {url:'<xsl:value-of select="gui:finder/@list-url"/>'},
            selection : {
              url : '<xsl:value-of select="gui:finder/@selection-url"/>',
              value : '<xsl:value-of select="gui:finder/@selection-value"/>',
              parameter : '<xsl:value-of select="gui:finder/@selection-parameter"/>'
            },
            search : {parameter : '<xsl:value-of select="gui:finder/@search-parameter"/>'}
          }
        </xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>



  <!--doc title:'Font input' class:'hui.ui.FontInput' module:'input'
  <font-input name="«text»" key="«text»" value="«css-color»"/>
  -->
  <xsl:template match="gui:font-input">
    <span class="hui_fontinput" id="{generate-id()}">
      <a class="hui_dropdown" href="javascript://"><span><span><strong><xsl:comment/></strong></span></span></a>
      <a class="hui_fontinput" href="javascript://" tabindex="-1">a</a>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.FontInput({
        element:'<xsl:value-of select="generate-id()"/>'
        <xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        <xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>


  <!--doc title:'Location input' class:'hui.ui.LocationInput' module:'input'
  <location-input name="«text»" key="«text»" />
  -->
  <xsl:template match="gui:location-input">
    <span class="hui_locationinput" id="{generate-id()}">
      <span class="hui_locationinput_latitude"><span><input/></span></span>
      <span class="hui_locationinput_longitude"><span><input/></span></span>
      <a class="hui_locationinput_picker" href="javascript://"><xsl:comment/></a>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.LocationInput({
        element:'<xsl:value-of select="generate-id()"/>'
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        <xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Drop down' class:'hui.ui.DropDown' module:'input'
  <dropdown name="«text»" key="«text»" value="«text»" source="«name»" url="«url»" placeholder="«text»" adaptive="«boolean»" width="«pixels»">
      <item value="«text»" text="«text»"/>
  </dropdown>
  -->
  <xsl:template name="gui:dropdown" match="gui:dropdown">
    <a id="{generate-id()}" href="javascript://">
      <xsl:if test="@width">
        <xsl:attribute name="style">width:<xsl:value-of select="@width"/>px;</xsl:attribute>
      </xsl:if>
    <xsl:attribute name="class">
      <xsl:text>hui_dropdown</xsl:text>
      <xsl:if test="@adaptive='true'"> hui_dropdown_adaptive</xsl:if>
      <xsl:if test="@size='small' or ancestor::gui:cell"> hui_is_small</xsl:if>
    </xsl:attribute>
    <strong><xsl:comment/></strong>
    </a>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.DropDown(
        {element:'<xsl:value-of select="generate-id()"/>'
        ,name:'<xsl:value-of select="@name"/>'
        ,key:'<xsl:value-of select="@key"/>'
        ,value:'<xsl:value-of select="@value"/>'
        <xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
        <xsl:if test="@url">,url:'<xsl:value-of select="@url"/>'</xsl:if>
        <xsl:if test="@placeholder">,placeholder:'<xsl:value-of select="@placeholder"/>'</xsl:if>
      });
      with(<xsl:value-of select="generate-id()"/>_obj) {
        <xsl:for-each select="gui:item | gui:option"> <!-- TODO item is deprecated -->
          addItem({
            title : '<xsl:value-of select="@title"/><xsl:value-of select="@label"/><xsl:value-of select="@text"/>', <!-- TODO title,label is deprecated -->
            value : hui.intOrString('<xsl:call-template name="gui:escapeScript"><xsl:with-param name="text" select="@value"/></xsl:call-template>')
          });
        </xsl:for-each>
      }
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>






  <!--doc title:'Radio buttons' class:'hui.ui.Radiobuttons' module:'input'
  <radiobuttons name="«text»" key="«text»" value="«text»">
      <item value="«text»" text="«text»"/>
  </radiobuttons>
  -->
  <xsl:template name="gui:radiobuttons" match="gui:radiobuttons">
    <span class="hui_radiobuttons" id="{generate-id()}">
      <xsl:apply-templates/>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Radiobuttons({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>',
        value : '<xsl:value-of select="@value"/>',
        key : '<xsl:value-of select="@key"/>'
      });
      with (<xsl:value-of select="generate-id()"/>_obj) {
        <xsl:for-each select="gui:radiobutton | gui:item | gui:option"> <!-- TODO item and radiobutton is deprecated -->
          registerRadiobutton({id:'<xsl:value-of select="generate-id()"/>','value':'<xsl:value-of select="@value"/>'});
        </xsl:for-each>
      }
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:radiobuttons/gui:radiobutton | gui:radiobuttons/gui:item | gui:radiobuttons/gui:option">
    <a id="{generate-id()}" href="javascript://">
      <xsl:attribute name="class">
        <xsl:text>hui_radiobutton</xsl:text>
        <xsl:if test="@value=../@value"> hui_radiobutton_selected</xsl:if>
      </xsl:attribute>
      <span class="hui_radiobutton_button"><span><xsl:comment/></span></span>
      <span class="hui_radiobutton_label"><xsl:value-of select="@label"/><xsl:value-of select="@text"/></span>
    </a>
  </xsl:template>







  <!--doc title:'Check box' class:'hui.ui.Checkbox' module:'input'
  <checkbox name="«text»" key="«text»" value="«boolean»" label="«text»"/>
  -->
  <xsl:template name="gui:checkbox"  match="gui:checkbox">
    <a id="{generate-id()}" href="javascript://">
      <xsl:if test="@right">
        <xsl:attribute name="style">
          <xsl:text>margin-right:</xsl:text><xsl:value-of select="@right"/><xsl:text>px;</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">
        <xsl:text>hui_checkbox</xsl:text>
        <xsl:if test="@value='true'"> hui_checkbox_selected</xsl:if>
      </xsl:attribute>
      <span class="hui_checkbox_button"><xsl:comment/></span>
      <xsl:if test="@text!='' or @title!='' or @label!=''">
        <span class="hui_checkbox_label"><xsl:value-of select="@title"/><xsl:value-of select="@text"/><xsl:value-of select="@label"/></span>
      </xsl:if>
    </a>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Checkbox({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>',
        'key':'<xsl:value-of select="@key"/>',
        'value':'<xsl:value-of select="@value"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>





  <!--doc title:'Check boxes' class:'hui.ui.Checkboxes' module:'input'
  <checkboxes name="«text»" key="«text»" max-height="«pixels»">
      <item value="«text»" text="«text»"/>
      <items name="«text»" source="«name»"/>
  </checkboxes>
  -->
  <xsl:template name="gui:checkboxes" match="gui:checkboxes">
    <span class="hui_checkboxes" id="{generate-id()}">
      <xsl:if test="@max-height">
        <xsl:attribute name="style">max-height:<xsl:value-of select="@max-height"/>px; overflow: auto;</xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Checkboxes({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>',
        key:'<xsl:value-of select="@key"/>'
      });
      with (<xsl:value-of select="generate-id()"/>_obj) {
        <xsl:for-each select="gui:items | gui:options"> <!-- TODO items is deprecated -->
          registerItems(<xsl:value-of select="generate-id()"/>_obj);
        </xsl:for-each>
        <xsl:for-each select="gui:item | gui:option"> <!-- TODO item is deprecated -->
          registerItem({title:'<xsl:value-of select="@title"/><xsl:value-of select="@text"/>',value:hui.intOrString('<xsl:value-of select="@value"/>')});
        </xsl:for-each>
      }
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:checkboxes/gui:items | gui:checkboxes/gui:options">
    <span id="{generate-id()}">
      <xsl:comment/>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Checkboxes.Items({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>',source:<xsl:value-of select="@source"/>});
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:checkboxes/gui:item | gui:checkboxes/gui:option">
    <a class="hui_checkbox" href="javascript:void(0);">
      <span class="hui_checkbox_button"><xsl:comment/></span>
      <xsl:if test="@text!='' or @title!='' or @label!=''">
        <span class="hui_checkbox_label"><xsl:value-of select="@title"/><xsl:value-of select="@text"/></span>
      </xsl:if>
    </a>
  </xsl:template>



  <xsl:template match="gui:fields[not(@labels='above')]/gui:buttons">
    <tr>
      <td class="hui_fields_buttons">
        <xsl:if test="not(../@labels='above')">
          <xsl:attribute name="colspan">2</xsl:attribute>
        </xsl:if>
        <xsl:call-template name="gui:buttons"/>
      </td>
    </tr>
  </xsl:template>

  <!--doc title:'Buttons' class:'hui.ui.Buttons' module:'action'
  <buttons small="«boolean»" mini="«boolean»" aling="«'left' | 'center' | 'right'»" padding="«pixels»" top="«pixels»" left="«pixels»" right="«pixels»" bottom="«pixels»">
      <button···/>
  </buttons>
  -->
  <xsl:template match="gui:buttons" name="gui:buttons">
    <div>
      <xsl:attribute name="class">
        <xsl:text>hui_buttons</xsl:text>
        <xsl:if test="@align='right'">
          <xsl:text> hui_buttons_right</xsl:text>
        </xsl:if>
        <xsl:if test="@align='center'">
          <xsl:text> hui_buttons_center</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:attribute name="style">
        <xsl:if test="@padding">padding:<xsl:value-of select="@padding"/>px;</xsl:if>
        <xsl:if test="@top">padding-top:<xsl:value-of select="@top"/>px;</xsl:if>
        <xsl:if test="@left">padding-left:<xsl:value-of select="@left"/>px;</xsl:if>
        <xsl:if test="@bottom">padding-bottom:<xsl:value-of select="@bottom"/>px;</xsl:if>
        <xsl:if test="@right">padding-right:<xsl:value-of select="@right"/>px;</xsl:if>
      </xsl:attribute>
      <div class="hui_buttons_body">
        <xsl:apply-templates/>
      </div>
    </div>
  </xsl:template>

  <!--doc title:'Button' class:'hui.ui.Button' module:'action'
  <button text="«text»" icon="«icon»" name="«text»" small="«boolean»" mini="«boolean»" highlighted="«boolean»" disabled="«boolean»" variant="«'light'»" submit="«boolean»" click="«script»" url="«url»">
      <confirm text="«text»" ok="«text»" cancel="«text»"/>
  </button>
  -->
  <xsl:template match="gui:button" name="gui:button">
    <xsl:variable name="size">
      <xsl:choose>
        <xsl:when test="@large='true' or ../@large='true'">large</xsl:when>
        <xsl:when test="@regular='true' or ../@regular='true'">regular</xsl:when>
        <xsl:when test="@small='true' or ../@small='true'">small</xsl:when>
        <xsl:when test="@mini='true' or ../@mini='true'">mini</xsl:when>
        <xsl:when test="@tiny='true' or ../@tiny='true'">tiny</xsl:when>
      </xsl:choose>
    </xsl:variable>
    <a id="{generate-id()}" href="javascript://">
      <xsl:attribute name="class">
        <xsl:text>hui_button</xsl:text>
        <xsl:if test="@variant">
          <xsl:text> hui_button_</xsl:text><xsl:value-of select="@variant"/>
        </xsl:if>
        <xsl:if test="@disabled='true'"> hui_is_disabled</xsl:if>
        <xsl:if test="@highlighted='true'"> hui_is_highlighted</xsl:if>
        <xsl:choose>
          <xsl:when test="@small='true' or ../@small='true'">
            <xsl:text> hui_button_small</xsl:text>
          </xsl:when>
          <xsl:when test="@mini='true' or ../@mini='true'">
            <xsl:text> hui_button_mini</xsl:text>
          </xsl:when>
          <xsl:when test="@tiny='true' or ../@tiny='true'">
            <xsl:text> hui_button_tiny</xsl:text>
          </xsl:when>
        </xsl:choose>
      </xsl:attribute>
      <xsl:if test="@disabled='true'"><xsl:attribute name="tabindex">-1</xsl:attribute></xsl:if>
        <xsl:if test="@icon"><span style="background-image: url('{$context}/hui/icons/{@icon}16.png')">
          <xsl:attribute name="class">
            <xsl:text>hui_button_icon</xsl:text>
            <xsl:if test="(not(@title) or @title='') and (not(@text) or @text='')"><xsl:text> hui_button_icon_notext</xsl:text></xsl:if>
          </xsl:attribute>
          <xsl:comment/>
        </span></xsl:if>
      <xsl:value-of select="@title"/><xsl:value-of select="@text"/>
    </a>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Button({
        element:'<xsl:value-of select="generate-id()"/>'
        <xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
        <xsl:if test="@role">,role:'<xsl:value-of select="@role"/>'</xsl:if>
        <xsl:if test="@submit='true'">,submit:true</xsl:if>
        <xsl:if test="gui:confirm">
          ,confirm:{text:'<xsl:value-of select="gui:confirm/@text"/>',okText:'<xsl:value-of select="gui:confirm/@ok"/>',cancelText:'<xsl:value-of select="gui:confirm/@cancel"/>'}
        </xsl:if>
      });
      <xsl:if test="@click">
        <xsl:value-of select="generate-id()"/>_obj.listen({$click:function() {<xsl:value-of select="@click"/>}});
      </xsl:if>
      <xsl:if test="@url">
        <xsl:value-of select="generate-id()"/>_obj.listen({$click:function() {document.location='<xsl:value-of select="@url"/>'}});
      </xsl:if>
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>

  <xsl:template match="gui:group/gui:button">
    <tr>
      <td colspan="2">
        <xsl:call-template name="gui:button"/>
      </td>
    </tr>
  </xsl:template>



  <!--doc title:'Image input' class:'hui.ui.ImageInput' module:'input'
  <image-input name="«text»" source="«url»"/>
  -->
  <xsl:template match="gui:image-input">
    <span class="hui_imageinput" id="{generate-id()}" tabindex="0">
      <xsl:if test="@size">
        <xsl:attribute name="style">
          <xsl:text>width:</xsl:text><xsl:value-of select="@size"/><xsl:text>px; height:</xsl:text><xsl:value-of select="@size"/><xsl:text>px;</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <a href="javascript://" class="hui_imageinput_clear">
      <xsl:comment/>
      </a>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.ImageInput({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>',
        key : '<xsl:value-of select="@key"/>',
        url : '<xsl:value-of select="@url"/>'
        <xsl:if test="@size">
          ,width: <xsl:value-of select="@size"/>
          ,height: <xsl:value-of select="@size"/>
        </xsl:if>
        <xsl:if test="gui:finder">
          ,finder : {
            url : '<xsl:value-of select="gui:finder/@url"/>',
            title : '<xsl:value-of select="gui:finder/@title"/>',
            list : {url:'<xsl:value-of select="gui:finder/@list-url"/>'},
            selection : {
              url : '<xsl:value-of select="gui:finder/@selection-url"/>',
              value : '<xsl:value-of select="gui:finder/@selection-value"/>',
              parameter : '<xsl:value-of select="gui:finder/@selection-parameter"/>'
            },
            search : {parameter : '<xsl:value-of select="gui:finder/@search-parameter"/>'}
          }
        </xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>




  <!--doc title:'Code input' class:'hui.ui.CodeInput' module:'input'
  <code-input name="«text»"/>
  -->
  <xsl:template match="gui:code-input">
    <div id="{generate-id()}">
      <xsl:attribute name="class">
        <xsl:text>hui_codeinput</xsl:text>
        <xsl:if test="@height='full'">
          <xsl:text> hui_codeinput-full</xsl:text>
        </xsl:if>
      </xsl:attribute>
      <xsl:if test="@height!='' and @height!='full'">
        <xsl:attribute name="style"><xsl:value-of select="concat('height:',@height,'px;')"/></xsl:attribute>
      </xsl:if>
      <xsl:text disable-output-escaping='yes'><![CDATA[<textarea spellcheck="false" class="hui_codeinput_input"></textarea>]]></xsl:text>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.CodeInput({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>',
        key : '<xsl:value-of select="@key"/>'
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>




  <!--doc title:'Object input' class:'hui.ui.LinkInput' module:'input'
  <link-input name="«text»" key="«text»">
      <type···>
          <finder···>
      </type>
  </link-input>
  -->
  <xsl:template match="gui:link-input">
    <div class="hui_linkinput" id="{generate-id()}">
      <a id="{generate-id()}" href="javascript://" class="hui_dropdown">
        <span><span><strong><xsl:comment/></strong></span></span>
      </a>
      <span class="hui_linkinput_body">
      <input spellcheck="false" style="display:none;"/>
      <span class="hui_linkinput_object" style="display:none;">
        <span class="hui_linkinput_icon hui_icon_16"><xsl:comment/></span>
        <span class="hui_linkinput_title"><xsl:comment/></span>
        <xsl:comment/>
      </span>
      </span>
    </div>
    <script type="text/javascript">
      (function() {
        var types = [];
        <xsl:for-each select="gui:type">
          types.push({
            label : '<xsl:value-of select="@label"/>',
            key : '<xsl:value-of select="@key"/>',
            icon : '<xsl:value-of select="@icon"/>',
            lookupUrl : '<xsl:value-of select="@lookup-url"/>'
            <xsl:if test="gui:finder">
              ,finderOptions : {
                url : '<xsl:value-of select="gui:finder/@url"/>',
                title : '<xsl:value-of select="gui:finder/@title"/>',
                list : {url:'<xsl:value-of select="gui:finder/@list-url"/>'},
                selection : {
                  url : '<xsl:value-of select="gui:finder/@selection-url"/>',
                  value : '<xsl:value-of select="gui:finder/@selection-value"/>',
                  parameter : '<xsl:value-of select="gui:finder/@selection-parameter"/>'
                },
                search : {parameter : '<xsl:value-of select="gui:finder/@search-parameter"/>'}
              }
            </xsl:if>
          })
        </xsl:for-each>
        var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.LinkInput({
          element : '<xsl:value-of select="generate-id()"/>',
          name : '<xsl:value-of select="@name"/>',
          key : '<xsl:value-of select="@key"/>',
          types : types
        });
        <xsl:call-template name="gui:createobject"/>
      })()
    </script>
  </xsl:template>


  <!--             Tokens            -->


  <!--doc title:'Tokens (string list)' class:'hui.ui.TokenField' module:'input'
  <tokens name="«text»" key="«text»"/>
  -->
  <xsl:template match="gui:tokens">
    <div class="hui_tokenfield" id="{generate-id()}">
      <xsl:comment/>
    </div>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.TokenField({
        element:'<xsl:value-of select="generate-id()"/>',
        name:'<xsl:value-of select="@name"/>',
        'key':'<xsl:value-of select="@key"/>'}
        );
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>


  <!--doc title:'Slider' class:'hui.ui.Slider' module:'input'
  <slider name="«text»" key="«text»" width="«pixels»"/>
  -->
  <xsl:template match="gui:slider">
    <span class="hui_slider" id="{generate-id()}">
      <xsl:if test="@width"><xsl:attribute name="style">width: <xsl:value-of select="@width"/>px;</xsl:attribute></xsl:if>
      <a href="javascript://" class="hui_slider_knob"><xsl:comment/></a><span class="hui_slider_bar"><xsl:comment/></span>
    </span>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Slider({
        element : '<xsl:value-of select="generate-id()"/>',
        name : '<xsl:value-of select="@name"/>',
        'key' : '<xsl:value-of select="@key"/>'
        <xsl:if test="@value">
          ,value:<xsl:value-of select="@value"/>
        </xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
    </script>
  </xsl:template>




  <!--doc title:'Object list' class:'hui.ui.ObjectList' module:'input'
  <objectlist name="«text»" key="«text»">
      <text key="«text»" label="«text»"/>
      <select key="«text»" label="«text»">
          <option value="«text»" text="«text»"/>
      </select>
  </objectlist>
  -->
  <xsl:template match="gui:objectlist" name="gui:objectlist">
    <table cellspacing="0" cellpadding="0" id="{generate-id()}" class="hui_objectlist">
      <xsl:if test="gui:text/@label">
        <thead>
          <tr>
            <xsl:for-each select="gui:text | gui:select">
              <th class="hui_objectlist hui_objectlist{position()}" style="width: {100 div count(../*)}%;"><xsl:value-of select="@label"/></th>
            </xsl:for-each>
          </tr>
        </thead>
      </xsl:if>
      <tbody>
        <xsl:comment/>
      </tbody>
    </table>
    <script type="text/javascript">
      var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.ObjectList({
        element : '<xsl:value-of select="generate-id()"/>'
        ,key:'<xsl:value-of select="@key"/>'
        <xsl:if test="@name">,name : '<xsl:value-of select="@name"/>'</xsl:if>
      });
      <xsl:call-template name="gui:createobject"/>
      with (<xsl:value-of select="generate-id()"/>_obj) {
        <xsl:apply-templates select="gui:text | gui:select"/>
        ignite();
      }
    </script>
  </xsl:template>

  <xsl:template match="gui:objectlist/gui:text">
    registerTemplateItem(new hui.ui.ObjectList.Text('<xsl:value-of select="@key"/>'));
  </xsl:template>

  <xsl:template match="gui:objectlist/gui:select">
    <xsl:variable name="id" select="generate-id()"/>
    var <xsl:value-of select="$id"/> = new hui.ui.ObjectList.Select('<xsl:value-of select="@key"/>');
    <xsl:for-each select="gui:option">
      <xsl:value-of select="$id"/>.addOption('<xsl:value-of select="@value"/>','<xsl:value-of select="@label"/><xsl:value-of select="@text"/>');
    </xsl:for-each>
    registerTemplateItem(<xsl:value-of select="generate-id()"/>);
  </xsl:template>

</xsl:stylesheet>