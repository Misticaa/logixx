import"./modulepreload-polyfill-B5Qt9EMX.js";import{D}from"./database-CTJo1PQf.js";import{C as v}from"./cpf-validator-B4PsRAE6.js";class T{constructor(){this.dbService=new D,this.currentView="leadsView",this.leads=[],this.filteredLeads=[],this.currentPage=1,this.leadsPerPage=20,this.selectedLeads=new Set,this.systemMode="auto",this.autoUpdateInterval=null,this.bulkImportData=[],this.isImporting=!1,this.automationPaused=!1,this.automationTimers=[],console.log("🎛️ AdminPanel inicializado"),this.init()}async init(){try{await this.setupAuthentication(),await this.setupEventListeners(),await this.loadLeads(),this.startAutoUpdate(),console.log("✅ AdminPanel configurado com sucesso")}catch(e){console.error("❌ Erro na inicialização do AdminPanel:",e)}}async setupAuthentication(){const e=document.getElementById("loginScreen"),t=document.getElementById("adminPanel"),o=document.getElementById("loginForm"),a=document.getElementById("passwordInput"),s=document.getElementById("errorMessage");if(localStorage.getItem("admin_logged_in")==="true"){e.style.display="none",t.style.display="block";return}o.addEventListener("submit",d=>{d.preventDefault();const i=a.value;["admin123","k7admin","logix2024"].includes(i)?(localStorage.setItem("admin_logged_in","true"),e.style.display="none",t.style.display="block",s.style.display="none"):(s.textContent="Senha incorreta. Tente novamente.",s.style.display="block",a.value="")});const n=document.getElementById("logoutButton");n&&n.addEventListener("click",()=>{localStorage.removeItem("admin_logged_in"),location.reload()})}async setupEventListeners(){var e,t,o,a,s,n,d,i,r,l,u,c;(e=document.getElementById("showLeadsView"))==null||e.addEventListener("click",()=>{this.showView("leadsView")}),(t=document.getElementById("showAddLeadView"))==null||t.addEventListener("click",()=>{this.showView("addLeadView")}),(o=document.getElementById("showBulkAddView"))==null||o.addEventListener("click",()=>{this.showView("bulkAddView")}),(a=document.getElementById("addLeadForm"))==null||a.addEventListener("submit",p=>{this.handleAddLead(p)}),(s=document.getElementById("systemMode"))==null||s.addEventListener("change",p=>{this.updateSystemMode(p.target.value)}),(n=document.getElementById("applyFiltersButton"))==null||n.addEventListener("click",()=>{this.applyFilters()}),(d=document.getElementById("refreshButton"))==null||d.addEventListener("click",()=>{this.refreshLeads()}),(i=document.getElementById("clearAllButton"))==null||i.addEventListener("click",()=>{this.clearAllLeads()}),(r=document.getElementById("massNextStage"))==null||r.addEventListener("click",()=>{this.handleMassAction("next")}),(l=document.getElementById("massPrevStage"))==null||l.addEventListener("click",()=>{this.handleMassAction("prev")}),(u=document.getElementById("massSetStage"))==null||u.addEventListener("click",()=>{this.handleMassAction("set")}),(c=document.getElementById("massDeleteLeads"))==null||c.addEventListener("click",()=>{this.handleMassAction("delete")}),this.setupBulkImportEvents(),this.setupModalEvents(),this.setupAutomationControls(),this.setupRefreshButton()}setupBulkImportEvents(){console.log("🔧 Configurando eventos de importação em massa...");const e=document.getElementById("previewBulkDataButton");e&&e.addEventListener("click",()=>{console.log("🔍 Botão de pré-visualização clicado"),this.previewBulkData()});const t=document.getElementById("clearBulkDataButton");t&&t.addEventListener("click",()=>{this.clearBulkData()});const o=document.getElementById("confirmBulkImportButton");o&&o.addEventListener("click",()=>{this.confirmBulkImport()});const a=document.getElementById("editBulkDataButton");a&&a.addEventListener("click",()=>{this.editBulkData()}),console.log("✅ Eventos de importação em massa configurados")}setupAutomationControls(){const e=document.getElementById("pauseAutomationButton"),t=document.getElementById("resumeAutomationButton");e&&e.addEventListener("click",()=>{this.pauseAutomation()}),t&&t.addEventListener("click",()=>{this.resumeAutomation()})}setupRefreshButton(){const e=document.getElementById("refreshLeadsButton");e&&e.addEventListener("click",()=>{this.refreshLeads(),this.showNotification("Lista de leads atualizada!","success")})}pauseAutomation(){this.automationPaused=!0,this.automationTimers.forEach(a=>clearTimeout(a)),this.automationTimers=[];const e=document.getElementById("pauseAutomationButton"),t=document.getElementById("resumeAutomationButton"),o=document.getElementById("systemStatus");e&&(e.style.display="none"),t&&(t.style.display="inline-flex"),o&&(o.innerHTML='<i class="fas fa-pause"></i> Automação Pausada',o.className="status-indicator manual"),console.log("⏸️ Automação pausada"),this.showNotification("Automação pausada","warning")}resumeAutomation(){this.automationPaused=!1;const e=document.getElementById("pauseAutomationButton"),t=document.getElementById("resumeAutomationButton"),o=document.getElementById("systemStatus");e&&(e.style.display="inline-flex"),t&&(t.style.display="none"),o&&(o.innerHTML='<i class="fas fa-robot"></i> Modo Automático',o.className="status-indicator auto"),this.restartAutomationForPendingLeads(),console.log("▶️ Automação retomada"),this.showNotification("Automação retomada","success")}restartAutomationForPendingLeads(){if(this.automationPaused)return;const t=this.dbService.getAllLeads().filter(o=>o.etapa_atual<16);console.log(`🔄 Reiniciando automação para ${t.length} leads pendentes`),t.forEach((o,a)=>{if(this.automationPaused)return;const s=(a+1)*3e4,n=setTimeout(()=>{!this.automationPaused&&o.etapa_atual<16&&this.advanceLeadStage(o.cpf)},s);this.automationTimers.push(n)})}showNotification(e,t="info"){const o=document.querySelector(".admin-notification");o&&o.remove();const a=document.createElement("div");a.className="admin-notification";const s={success:"#d4edda",warning:"#fff3cd",error:"#f8d7da",info:"#d1ecf1"},n={success:"#155724",warning:"#856404",error:"#721c24",info:"#0c5460"};a.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${s[t]||s.info};
            color: ${n[t]||n.info};
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-weight: 600;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        `,a.textContent=e,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.remove()},3e3)}previewBulkData(){console.log("🔍 Iniciando pré-visualização de dados em massa...");const e=document.getElementById("bulkDataTextarea");if(!e){console.error("❌ Textarea não encontrado");return}const t=e.value;if(console.log("📝 Dados brutos obtidos:",{length:t.length,hasContent:!!t.trim(),firstChars:t.substring(0,100)}),!t||t.trim().length===0){console.warn("⚠️ Nenhum dado encontrado no textarea"),this.showError("Por favor, cole os dados da planilha no campo de texto.");return}try{const o=this.parseRawBulkData(t);if(!o.success){console.error("❌ Erro no parse:",o.error),this.showError(o.error);return}console.log("✅ Dados parseados com sucesso:",{totalLeads:o.leads.length,errors:o.errors.length,duplicates:o.duplicates.length}),this.bulkImportData=o.leads,this.displayBulkPreview(o)}catch(o){console.error("💥 Erro na pré-visualização:",o),this.showError(`Erro ao processar dados: ${o.message}`)}}parseRawBulkData(e){console.log("📊 Iniciando parse de dados brutos...");try{const t=e.trim().split(`
`).filter(r=>r.trim().length>0);if(t.length===0)return{success:!1,error:"Nenhuma linha válida encontrada nos dados colados."};console.log(`📋 Total de linhas para processar: ${t.length}`);const o=[],a=[],s=[],n=new Set,d=JSON.parse(localStorage.getItem("leads")||"[]"),i=new Set(d.map(r=>r.cpf?r.cpf.replace(/[^\d]/g,""):""));console.log(`🗄️ CPFs existentes no banco: ${i.size}`);for(let r=0;r<t.length;r++){const l=r+1,u=t[r].trim();if(u){console.log(`📝 Processando linha ${l}: ${u.substring(0,100)}...`);try{let c=[];if(u.includes("	")?(c=u.split("	"),console.log(`🔍 Linha ${l}: Detectado separador TAB, ${c.length} campos`)):u.includes("  ")?(c=u.split(/\s{2,}/),console.log(`🔍 Linha ${l}: Detectado espaços múltiplos, ${c.length} campos`)):(c=u.split(/\s+/),console.log(`🔍 Linha ${l}: Detectado espaço simples, ${c.length} campos`)),c=c.map(y=>y.trim()).filter(y=>y.length>0),console.log(`📊 Linha ${l}: ${c.length} campos após limpeza:`,c),c.length<4){a.push({line:l,error:`Poucos campos encontrados: ${c.length}. Mínimo necessário: 4 (Nome, Email, Telefone, CPF)`,data:u});continue}const[p,g,h,f,b="Kit 262 Cores Canetinhas Coloridas Edição Especial Com Ponta Dupla",P="47.39",w="",E="",I="",L="",B="",$="",k="",S="BR"]=c;if(console.log(`👤 Linha ${l} - Dados extraídos:`,{nome:p,email:g,telefone:h,cpf:f}),!p||p.length<2){a.push({line:l,error:"Nome do cliente é obrigatório e deve ter pelo menos 2 caracteres",data:u});continue}if(!g||!g.includes("@")){a.push({line:l,error:"Email é obrigatório e deve ser válido",data:u});continue}if(!h||h.replace(/[^\d]/g,"").length<10){a.push({line:l,error:"Telefone é obrigatório e deve ter pelo menos 10 dígitos",data:u});continue}const m=f?f.replace(/[^\d]/g,""):"";if(!m||m.length!==11){a.push({line:l,error:"CPF é obrigatório e deve ter exatamente 11 dígitos",data:u});continue}if(n.has(m)){s.push({line:l,cpf:m,nome:p,type:"lista"});continue}if(i.has(m)){s.push({line:l,cpf:m,nome:p,type:"banco"});continue}const x=this.parseValue(P),A=this.buildFullAddress({endereco:w,numero:E,complemento:I,bairro:L,cep:B,cidade:$,estado:k,pais:S}),C={nome_completo:p,email:g,telefone:h,cpf:m,produto:b,valor_total:x,endereco:A,meio_pagamento:"PIX",origem:"direto",etapa_atual:1,status_pagamento:"pendente",order_bumps:[],produtos:[{nome:b,preco:x}],lineNumber:l};o.push(C),n.add(m),console.log(`✅ Linha ${l}: Lead criado com sucesso para ${p}`)}catch(c){console.error(`❌ Erro na linha ${l}:`,c),a.push({line:l,error:`Erro ao processar linha: ${c.message}`,data:u})}}}return console.log("📊 Resultado final do parse:",{leadsValidos:o.length,erros:a.length,duplicatas:s.length}),{success:!0,leads:o,errors:a,duplicates:s,totalProcessed:t.length}}catch(t){return console.error("💥 Erro crítico no parse:",t),{success:!1,error:`Erro crítico ao processar dados: ${t.message}`}}}parseValue(e){if(!e)return 47.39;const t=e.toString().replace(",",".").trim(),o=parseFloat(t);return isNaN(o)?47.39:o}buildFullAddress({endereco:e,numero:t,complemento:o,bairro:a,cep:s,cidade:n,estado:d,pais:i}){const r=[];return e&&r.push(e),t&&r.push(t),o&&r.push(`- ${o}`),a&&r.push(`- ${a}`),n&&d&&r.push(`- ${n}/${d}`),s&&r.push(`- CEP: ${s}`),i&&i!=="BR"&&r.push(`- ${i}`),r.join(" ")||"Endereço não informado"}displayBulkPreview(e){console.log("🖥️ Exibindo pré-visualização...");const t=document.getElementById("bulkPreviewSection"),o=document.getElementById("bulkPreviewContainer"),a=document.getElementById("previewSummary"),s=document.getElementById("confirmBulkImportButton");if(!t||!o){console.error("❌ Elementos de pré-visualização não encontrados");return}t.style.display="block";let n=`
            <div style="max-height: 400px; overflow: auto; border: 1px solid #ddd;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead style="background: #345C7A; color: white; position: sticky; top: 0;">
                        <tr>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 40px;">#</th>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 150px;">Nome</th>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 180px;">Email</th>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 120px;">Telefone</th>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 100px;">CPF</th>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 200px;">Produto</th>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 80px;">Valor</th>
                            <th style="padding: 8px; border: 1px solid #ddd; min-width: 250px;">Endereço</th>
                        </tr>
                    </thead>
                    <tbody>
        `;if(e.leads.forEach((d,i)=>{const r=i%2===0?"#f8f9fa":"#ffffff";n+=`
                <tr style="background: ${r};">
                    <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${d.lineNumber}</td>
                    <td style="padding: 6px; border: 1px solid #ddd;" title="${d.nome_completo}">
                        ${this.truncateText(d.nome_completo,20)}
                    </td>
                    <td style="padding: 6px; border: 1px solid #ddd;" title="${d.email}">
                        ${this.truncateText(d.email,25)}
                    </td>
                    <td style="padding: 6px; border: 1px solid #ddd;">${d.telefone}</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">${v.formatCPF(d.cpf)}</td>
                    <td style="padding: 6px; border: 1px solid #ddd;" title="${d.produto}">
                        ${this.truncateText(d.produto,30)}
                    </td>
                    <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">
                        R$ ${d.valor_total.toFixed(2)}
                    </td>
                    <td style="padding: 6px; border: 1px solid #ddd;" title="${d.endereco}">
                        ${this.truncateText(d.endereco,35)}
                    </td>
                </tr>
            `}),n+=`
                    </tbody>
                </table>
            </div>
        `,e.errors.length>0||e.duplicates.length>0){n+=`
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
                    <h5 style="color: #856404; margin-bottom: 10px;">
                        <i class="fas fa-exclamation-triangle"></i> 
                        Problemas Encontrados (${e.errors.length+e.duplicates.length})
                    </h5>
                    <div style="max-height: 150px; overflow-y: auto;">
            `;const d=[...e.errors,...e.duplicates];d.slice(0,10).forEach(i=>{const r=i.type?`Duplicata (${i.type})`:"Erro";n+=`
                    <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #dc3545;">
                        <strong>Linha ${i.line}:</strong> ${r} - ${i.error||`CPF ${v.formatCPF(i.cpf)} já existe`}
                    </div>
                `}),d.length>10&&(n+=`
                    <div style="text-align: center; color: #666; font-style: italic; margin-top: 10px;">
                        ... e mais ${d.length-10} problemas
                    </div>
                `),n+=`
                    </div>
                </div>
            `}o.innerHTML=n,a&&(a.innerHTML=`
                <i class="fas fa-info-circle"></i>
                ${e.leads.length} registros válidos, 
                ${e.errors.length} erros, 
                ${e.duplicates.length} duplicatas
            `),s&&(e.leads.length>0?(s.style.display="inline-block",s.textContent=`Importar ${e.leads.length} Registros`):s.style.display="none"),console.log("✅ Pré-visualização exibida com sucesso")}truncateText(e,t){return e?e.length>t?e.substring(0,t)+"...":e:""}async confirmBulkImport(){if(this.isImporting){console.warn("⚠️ Importação já em andamento");return}if(!this.bulkImportData||this.bulkImportData.length===0){this.showError("Nenhum dado válido para importar");return}this.isImporting=!0,console.log(`🚀 Iniciando importação de ${this.bulkImportData.length} leads...`),this.showImportProgress();try{const e={success:0,errors:0,total:this.bulkImportData.length};for(let t=0;t<this.bulkImportData.length;t++){const o=this.bulkImportData[t];try{o.id=Date.now().toString()+Math.random().toString(36).substr(2,9),o.created_at=new Date().toISOString(),o.updated_at=new Date().toISOString();const a=JSON.parse(localStorage.getItem("leads")||"[]");a.push(o),localStorage.setItem("leads",JSON.stringify(a)),e.success++,console.log(`✅ Lead ${t+1}/${this.bulkImportData.length} importado: ${o.nome_completo}`)}catch(a){console.error(`❌ Erro ao importar lead ${t+1}:`,a),e.errors++}this.updateImportProgress(t+1,this.bulkImportData.length),t%10===0&&await new Promise(a=>setTimeout(a,100))}this.finishImport(e)}catch(e){console.error("💥 Erro crítico na importação:",e),this.showError(`Erro na importação: ${e.message}`)}finally{this.isImporting=!1}}showImportProgress(){const e=document.getElementById("bulkResultsSection"),t=document.getElementById("bulkResultsContainer");!e||!t||(e.style.display="block",t.innerHTML=`
            <div style="text-align: center; padding: 20px;">
                <div style="margin-bottom: 15px;">
                    <i class="fas fa-upload" style="font-size: 2rem; color: #345C7A; animation: pulse 1s infinite;"></i>
                </div>
                <h4 style="color: #345C7A; margin-bottom: 15px;">Importando Leads...</h4>
                <div id="importProgressBar" style="
                    width: 100%; 
                    height: 20px; 
                    background: #e9ecef; 
                    border-radius: 10px; 
                    overflow: hidden;
                    margin-bottom: 10px;
                ">
                    <div id="importProgressFill" style="
                        width: 0%; 
                        height: 100%; 
                        background: linear-gradient(45deg, #345C7A, #2c4a63); 
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div id="importProgressText">0 / ${this.bulkImportData.length} leads processados</div>
            </div>
        `)}updateImportProgress(e,t){const o=document.getElementById("importProgressFill"),a=document.getElementById("importProgressText");if(o&&a){const s=e/t*100;o.style.width=`${s}%`,a.textContent=`${e} / ${t} leads processados`}}finishImport(e){const t=document.getElementById("bulkResultsContainer");t&&(t.innerHTML=`
                <div style="text-align: center; padding: 20px;">
                    <div style="margin-bottom: 15px;">
                        <i class="fas fa-check-circle" style="font-size: 2rem; color: #27ae60;"></i>
                    </div>
                    <h4 style="color: #27ae60; margin-bottom: 15px;">Importação Concluída!</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div style="padding: 15px; background: #d4edda; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #155724;">${e.success}</div>
                            <div style="color: #155724;">Sucessos</div>
                        </div>
                        <div style="padding: 15px; background: #f8d7da; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #721c24;">${e.errors}</div>
                            <div style="color: #721c24;">Erros</div>
                        </div>
                    </div>
                    <button onclick="adminPanel.showView('leadsView'); adminPanel.refreshLeads();" style="
                        background: #345C7A; 
                        color: white; 
                        border: none; 
                        padding: 12px 25px; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        <i class="fas fa-list"></i> Ver Lista de Leads
                    </button>
                </div>
            `),this.clearBulkData(),this.refreshLeads(),console.log(`🎉 Importação finalizada: ${e.success} sucessos, ${e.errors} erros`)}clearBulkData(){const e=document.getElementById("bulkDataTextarea"),t=document.getElementById("bulkPreviewSection"),o=document.getElementById("bulkResultsSection");e&&(e.value=""),t&&(t.style.display="none"),o&&(o.style.display="none"),this.bulkImportData=[],console.log("🧹 Dados de importação limpos")}editBulkData(){const e=document.getElementById("bulkPreviewSection");e&&(e.style.display="none"),this.bulkImportData=[]}showView(e){document.querySelectorAll(".admin-view").forEach(s=>{s.style.display="none"}),document.querySelectorAll(".nav-button").forEach(s=>{s.classList.remove("active")});const t=document.getElementById(e);t&&(t.style.display="block");const o={leadsView:"showLeadsView",addLeadView:"showAddLeadView",bulkAddView:"showBulkAddView"},a=document.getElementById(o[e]);a&&a.classList.add("active"),this.currentView=e,e==="leadsView"&&this.refreshLeads()}async loadLeads(){try{const e=await this.dbService.getData();e.success&&(this.leads=e.data||[],this.filteredLeads=[...this.leads],this.updateLeadsDisplay(),console.log(`📊 ${this.leads.length} leads carregados`))}catch(e){console.error("❌ Erro ao carregar leads:",e)}}async refreshLeads(){console.log("🔄 Atualizando lista de leads..."),await this.loadLeads(),this.applyFilters()}applyFilters(){const e=document.getElementById("searchInput"),t=document.getElementById("dateFilter"),o=document.getElementById("stageFilter");let a=[...this.leads];if(e&&e.value.trim()){const s=e.value.toLowerCase();a=a.filter(n=>n.nome_completo&&n.nome_completo.toLowerCase().includes(s)||n.cpf&&n.cpf.includes(s.replace(/[^\d]/g,"")))}if(t&&t.value){const s=new Date(t.value);a=a.filter(n=>new Date(n.created_at).toDateString()===s.toDateString())}if(o&&o.value&&o.value!=="all")if(o.value==="awaiting_payment")a=a.filter(s=>{const n=s.etapa_atual||1,d=s.status_pagamento||"pendente";return n===11&&d==="pendente"||n===16||n===106||n===116||n===126});else{const s=parseInt(o.value);a=a.filter(n=>(n.etapa_atual||1)===s)}this.filteredLeads=a,this.currentPage=1,this.updateLeadsDisplay(),console.log(`🔍 Filtros aplicados: ${a.length} leads encontrados`)}updateLeadsDisplay(){const e=document.getElementById("leadsTableBody"),t=document.getElementById("leadsCount"),o=document.getElementById("emptyState"),a=document.getElementById("paginationControls");if(!e)return;if(t){const i=this.leads.filter(r=>{const l=r.etapa_atual||1,u=r.status_pagamento||"pendente";return l===11&&u==="pendente"||l===16||l===106||l===116||l===126}).length;t.innerHTML=`
                ${this.filteredLeads.length} leads
                ${i>0?`<span style="background: #ffc107; color: #212529; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 8px;">💳 ${i} aguardando pagamento</span>`:""}
            `}const s=(this.currentPage-1)*this.leadsPerPage,n=s+this.leadsPerPage,d=this.filteredLeads.slice(s,n);if(d.length===0){e.innerHTML="",o&&(o.style.display="block"),a&&(a.style.display="none");return}o&&(o.style.display="none"),a&&(a.style.display="flex"),e.innerHTML=d.map(i=>{const r=i.etapa_atual||1,l=i.status_pagamento||"pendente";let u=this.getStageDisplayName(r),c="";return(r===11&&l==="pendente"||r===16||r===106||r===116||r===126)&&(c=" 💳",u+=" (Aguardando Pagamento)"),`
                <tr>
                    <td>
                        <input type="checkbox" class="lead-checkbox" data-lead-id="${i.id}" 
                               onchange="adminPanel.toggleLeadSelection('${i.id}', this.checked)">
                    </td>
                    <td title="${i.nome_completo||"N/A"}">${this.truncateText(i.nome_completo||"N/A",20)}</td>
                    <td>${v.formatCPF(i.cpf||"")}</td>
                    <td title="${i.email||"N/A"}">${this.truncateText(i.email||"N/A",25)}</td>
                    <td>${i.telefone||"N/A"}</td>
                    <td title="${i.produto||"N/A"}">${this.truncateText(i.produto||"N/A",30)}</td>
                    <td>R$ ${(i.valor_total||0).toFixed(2)}</td>
                    <td>${this.formatDate(i.created_at)}</td>
                    <td>
                        <span class="stage-badge ${this.getStageClass(r,l)}">
                            ${r}${c}
                        </span>
                        <div style="font-size: 0.8rem; color: #666; margin-top: 2px;">
                            ${u}
                        </div>
                    </td>
                    <td>${this.formatDate(i.updated_at)}</td>
                    <td>
                        <div class="lead-actions">
                            <button class="action-button edit" onclick="adminPanel.editLead('${i.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-button next" onclick="adminPanel.nextStage('${i.id}')">
                                <i class="fas fa-forward"></i>
                            </button>
                            <button class="action-button prev" onclick="adminPanel.prevStage('${i.id}')">
                                <i class="fas fa-backward"></i>
                            </button>
                            <button class="action-button delete" onclick="adminPanel.deleteLead('${i.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join(""),this.updatePaginationControls(),this.updateMassActionButtons()}getStageDisplayName(e){return{1:"Pedido criado",2:"Preparando envio",3:"Vendedor enviou",4:"Centro triagem Shenzhen",5:"Centro logístico Shenzhen",6:"Trânsito internacional",7:"Liberado exportação",8:"Saiu origem Shenzhen",9:"Chegou no Brasil",10:"Trânsito Curitiba/PR",11:"Alfândega importação",12:"Liberado alfândega",13:"Sairá para entrega",14:"Em trânsito entrega",15:"Rota de entrega",16:"1ª Tentativa entrega",106:"2ª Tentativa entrega",116:"3ª Tentativa entrega",126:"1ª Tentativa entrega (Ciclo 2)"}[e]||`Etapa ${e}`}getStageClass(e,t){return e===11&&t==="pendente"||e===16||e===106||e===116||e===126?"pending":e>=17||t==="pago"?"completed":""}addAwaitingPaymentFilter(){const e=document.getElementById("stageFilter");if(e&&!document.querySelector('option[value="awaiting_payment"]')){const t=document.createElement("option");t.value="awaiting_payment",t.textContent="💳 Aguardando Pagamento",e.appendChild(t)}}formatDate(e){return e?new Date(e).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"N/A"}showError(e){console.error("❌ Erro:",e),alert(e)}toggleLeadSelection(e,t){t?this.selectedLeads.add(e):this.selectedLeads.delete(e),this.updateMassActionButtons()}toggleSelectAll(e){document.querySelectorAll(".lead-checkbox").forEach(o=>{o.checked=e,this.toggleLeadSelection(o.dataset.leadId,e)})}updateMassActionButtons(){const e=this.selectedLeads.size;["massNextStage","massPrevStage","massSetStage","massDeleteLeads"].forEach(a=>{const s=document.getElementById(a);if(s){s.disabled=e===0;const n=s.querySelector(".action-count");n&&(n.textContent=`(${e} leads)`)}});const o=document.getElementById("selectedCount");o&&(o.textContent=`${e} selecionados`)}updatePaginationControls(){const e=document.getElementById("paginationControls");if(!e)return;const t=Math.ceil(this.filteredLeads.length/this.leadsPerPage),o=(this.currentPage-1)*this.leadsPerPage+1,a=Math.min(this.currentPage*this.leadsPerPage,this.filteredLeads.length);e.innerHTML=`
            <div class="pagination-info">
                <span style="color: #666; font-size: 0.9rem;">
                    Exibindo ${o}-${a} de ${this.filteredLeads.length} leads
                </span>
            </div>
            
            <div class="pagination-controls">
                <div class="pagination-buttons">
                    <button 
                        class="pagination-btn" 
                        id="prevPageBtn"
                        ${this.currentPage<=1?"disabled":""}
                        onclick="adminPanel.goToPage(${this.currentPage-1})"
                    >
                        <i class="fas fa-chevron-left"></i> Anterior
                    </button>
                    
                    <div class="page-info">
                        <span style="margin: 0 15px; font-weight: 600; color: #345C7A;">
                            Página ${this.currentPage} de ${t}
                        </span>
                    </div>
                    
                    <button 
                        class="pagination-btn" 
                        id="nextPageBtn"
                        ${this.currentPage>=t?"disabled":""}
                        onclick="adminPanel.goToPage(${this.currentPage+1})"
                    >
                        Próximo <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="per-page-selector">
                    <label for="leadsPerPageSelect" style="margin-right: 8px; color: #666; font-size: 0.9rem;">
                        Leads por página:
                    </label>
                    <select 
                        id="leadsPerPageSelect" 
                        class="per-page-select"
                        onchange="adminPanel.changeLeadsPerPage(this.value)"
                    >
                        <option value="20" ${this.leadsPerPage===20?"selected":""}>20</option>
                        <option value="50" ${this.leadsPerPage===50?"selected":""}>50</option>
                        <option value="100" ${this.leadsPerPage===100?"selected":""}>100</option>
                        <option value="500" ${this.leadsPerPage===500?"selected":""}>500</option>
                    </select>
                </div>
            </div>
        `}goToPage(e){const t=Math.ceil(this.filteredLeads.length/this.leadsPerPage);e<1||e>t||(this.currentPage=e,this.updateLeadsDisplay(),console.log(`📄 Navegando para página ${e} de ${t}`))}changeLeadsPerPage(e){const t=this.leadsPerPage;this.leadsPerPage=parseInt(e);const o=(this.currentPage-1)*t+1;this.currentPage=Math.ceil(o/this.leadsPerPage),this.updateLeadsDisplay(),console.log(`📊 Leads por página alterado: ${t} → ${this.leadsPerPage}`)}setupModalEvents(){}startAutoUpdate(){this.systemMode==="auto"&&(this.autoUpdateInterval=setInterval(()=>{this.processAutoUpdates()},2*60*60*1e3))}processAutoUpdates(){}updateSystemMode(e){this.systemMode=e;const t=document.getElementById("systemStatus");t&&(e==="auto"?(t.innerHTML='<i class="fas fa-robot"></i> Modo Automático',t.className="status-indicator auto",this.startAutoUpdate()):(t.innerHTML='<i class="fas fa-hand-paper"></i> Modo Manual',t.className="status-indicator manual",this.autoUpdateInterval&&(clearInterval(this.autoUpdateInterval),this.autoUpdateInterval=null)))}advanceLeadStage(e){if(this.automationPaused){console.log("⏸️ Automação pausada, não avançando etapa");return}try{const t=this.dbService.getAllLeads(),o=t.findIndex(i=>i.cpf===e);if(o===-1){console.warn(`⚠️ Lead com CPF ${e} não encontrado`);return}const a=t[o],s=a.etapa_atual||1;if(s>=16){console.log(`✅ Lead ${e} já está na etapa final (${s})`);return}const n=s+1,d={...a,etapa_atual:n,updated_at:new Date().toISOString()};if(t[o]=d,this.dbService.saveLeads(t),d.etapa_atual<16){const i=setTimeout(()=>{this.automationPaused||this.advanceLeadStage(e)},72e5);this.automationTimers.push(i)}console.log(`✅ Lead ${e} avançou para etapa ${d.etapa_atual}`),this.currentView==="leadsView"&&this.refreshLeads()}catch(t){console.error(`❌ Erro ao avançar etapa do lead ${e}:`,t)}}async handleAddLead(e){e.preventDefault()}async handleMassAction(e){}async editLead(e){}async nextStage(e){}async prevStage(e){}async deleteLead(e){}async clearAllLeads(){confirm("Tem certeza que deseja limpar todos os leads? Esta ação não pode ser desfeita.")&&(localStorage.setItem("leads","[]"),await this.refreshLeads(),console.log("🧹 Todos os leads foram removidos"))}}document.addEventListener("DOMContentLoaded",()=>{window.adminPanel=new T,setTimeout(()=>{window.adminPanel.addAwaitingPaymentFilter()},1e3)});
