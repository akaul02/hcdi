import re

with open("index.html", "r") as f:
    content = f.read()

new_book_content = """        <div class="book" id="portfolio-book">
            
            <!-- Sheet 8: Reflection 4 / Back Cover Solid -->
            <div class="page paper" id="sheet-8" style="--z: -3px; z-index: 0;">
                <div class="page-content right-page front-side">
                    <!-- Reflection 4 -->
                    <div class="reflection-block">
                        <h3>Design decisions as defaults</h3>
                        <div class="keywords">responsibility • specificity • clarity through writing • sycophancy</div>
                        <p>Design has power because defaults silently shape people’s decisions. With LLMs, that power becomes harder to manage because outputs are not deterministic, and it’s not feasible to have a human in the loop at every stage. Choices about guardrails, interface, release strategy, and user control are essential as early as possible in the process, before the product affects people.</p>
                        <p>Disasters in any city can span heat crises, housing crises, legal crises, communication failures, or healthcare breakdowns, and trying to design for all of that at once makes an idea soft. A stronger product centers a specific community, moment, and constraint, and writing forces the idea to stand on its own before polished language, or LLM sycophancy, makes it sound smarter than it is.</p>
                        <div class="related-readings">
                            related class readings: <a href="https://www.science.org/doi/10.1126/science.1091721" target="_blank" class="reading-link">Do Defaults Save Lives? ↗</a>; <a href="https://yalebooks.yale.edu/book/9780300262285/nudge/" target="_blank" class="reading-link">Nudge ↗</a>
                        </div>
                    </div>
                    <div class="page-number">14</div>
                </div>
                <div class="page-back back-cover-solid"></div>
            </div>

            <!-- Sheet 7: Reflection 2 / Reflection 3 -->
            <div class="page paper" id="sheet-7" style="--z: -2px; z-index: 1;">
                <div class="page-content right-page front-side">
                    <!-- Reflection 2 -->
                    <div class="reflection-block">
                        <h3>Experience unfolds over time</h3>
                        <div class="keywords">design value • business impact index • customer journeys</div>
                        <p>I believe design is not just polish at the end. It influences product decisions from the beginning and connects directly to trust, customer support, marketing, and even business outcomes, as seen in the McKinsey Design Index.</p>
                        <p>Customer journeys help me understand how an experience unfolds over time from a user-centric lens. People do not experience a product as one screen, but rather as a sequence of expectations, decisions, frictions, and memories. That connected to my work on Kindle, where building a new design system allowed readers to feel consistency across the whole product.</p>
                        <div class="related-readings">
                            related class readings: <a href="https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-business-value-of-design" target="_blank" class="reading-link">McKinsey Design Index ↗</a>; <a href="https://hbr.org/1998/07/welcome-to-the-experience-economy" target="_blank" class="reading-link">Experience Economy ↗</a>
                        </div>
                    </div>
                    <div class="page-number">12</div>
                </div>
                <div class="page-back page-content left-page">
                    <!-- Reflection 3 -->
                    <div class="reflection-block">
                        <h3>An app is not a solution</h3>
                        <div class="keywords">journey maps • prototypes as learning/testing • iteration</div>
                        <p>The line that stayed with me was simple: an app is not a solution. AI design and software tools today can draft and build a prototype in minutes before the idea underneath it has been tested.</p>
                        <p>A journey map shows that experience has a rhythm over time, while revision forces the designer to see the problem more clearly with each pass through the lens of behavior, trust, and assumptions. That connected to the researcher I want to be, not only someone who builds systems well, but someone who asks better questions, challenges the framing, and develops a stronger way of seeing what is worth researching.</p>
                        <div class="related-readings">
                            related class readings: <a href="https://hbr.org/2020/03/building-a-culture-of-experimentation" target="_blank" class="reading-link">Experimentation Culture ↗</a>; <a href="https://www.theguardian.com/books/2017/mar/04/what-writers-really-do-when-they-write" target="_blank" class="reading-link">George Saunders ↗</a>
                        </div>
                    </div>
                    <div class="page-number">13</div>
                </div>
            </div>

            <!-- Sheet 6: Coat Right / Reflection 1 -->
            <div class="page paper" id="sheet-6" style="--z: -1px; z-index: 2;">
                <div class="page-content right-page front-side">
                    <!-- Chapter 3 Right -->
                    <div class="editorial-layout" style="justify-content: center; padding-top: 10px;">
                        <img src="coat_design.png" alt="Coat Design Details" class="featured-sketch" style="max-height: 160px; margin-bottom: 15px; border: none; box-shadow: none;">
                        <div class="editorial-grid" style="grid-template-columns: 1fr; gap: 15px;">
                            <div class="editorial-section editorial-full">
                                <h4>Interview Insight</h4>
                                <p>Ana wanted a coat that could move between everyday life, dinners, cold weather, and social settings without needing a full outfit built around it. Her ideal coat was warm, elegant, subtle, and easy to restyle.</p>
                            </div>
                            <div class="editorial-section editorial-full">
                                <h4>Design Response</h4>
                                <p>I designed a Victoria Beckham-inspired transformable trench with a belted waist, convertible collar, removable warm liner, natural matte fabric, subtle water resistance, discreet outer pockets, and a hidden interior zip pocket.</p>
                            </div>
                            <div class="editorial-section editorial-full">
                                <h4>Takeaway</h4>
                                <p>The real need was not just a stylish coat. It was a coat that reduced effort while preserving presence: practical enough for daily use, polished enough to stand out, and quiet enough to avoid loud status signaling.</p>
                            </div>
                        </div>
                    </div>
                    <div class="page-number">10</div>
                </div>
                <div class="page-back page-content left-page">
                    <!-- Reflection 1 -->
                    <h2 class="chapter-title">4. Reflections</h2>
                    <div class="reflection-block">
                        <h3>People before prototypes</h3>
                        <div class="keywords">human-centered design • formative research • ethnographic interviewing</div>
                        <p>I am rethinking how I approach design problems. As an engineer, I prioritize technical feasibility, building, and novelty first, but this class pushed me to slow down and better understand the people I’m solving for before rushing into a solution.</p>
                        <p>I used to underestimate more informal qualitative work and surveys, but the readings helped me see how trust, rapport, and language shape what people actually share. This directly connects to my research, where understanding user experience and existing literature needs to come before implementation.</p>
                        <div class="related-readings">
                            related class readings: <a href="https://www.waveland.com/browse.php?t=688" target="_blank" class="reading-link">Spradley ↗</a>; <a href="https://www.tandfonline.com/doi/abs/10.5437/08956308X5703008" target="_blank" class="reading-link">Swiffer Story ↗</a>
                        </div>
                    </div>
                    <div class="page-number">11</div>
                </div>
            </div>

            <!-- Sheet 5: Bottle Right / Coat Left -->
            <div class="page paper" id="sheet-5" style="--z: 0px; z-index: 3;">
                <div class="page-content right-page front-side">
                    <!-- Chapter 2 Right -->
                    <div class="editorial-layout" style="justify-content: center; padding-top: 20px;">
                        <div class="editorial-grid">
                            <div class="editorial-section">
                                <h4>Value</h4>
                                <p>UV-C self-cleaning bottle with on-demand cleaning + automatic cleaning every 2 hours. Monthly charging reduces maintenance and cognitive. Less scrubbing, fewer odor concerns, and more confidence that the bottle is clean.</p>
                            </div>
                            <div class="editorial-section">
                                <h4>Competitors</h4>
                                <p><strong>Hydro Flask:</strong> durable and familiar, but requires regular scrubbing and can retain soap taste.<br><strong>Brita bottle:</strong> adds filtration, but still requires cleaning and expensive replacement filters.</p>
                            </div>
                            <div class="editorial-section editorial-full">
                                <h4>Why I chose it</h4>
                                <p>I bought the LARQ because it fit a real pattern in my life. I am often juggling classes, work, research, relationships, and my physical and mental health, so cleaning a bottle regularly can become a task that slips. LARQ stood out because it reduced maintenance while giving me a stronger sense of cleanliness and control.</p>
                            </div>
                            <div class="editorial-section editorial-full">
                                <h4>Takeaway</h4>
                                <p>This assignment helped me see that product choice is not only about features. It is also about the small frictions people are trying to remove from daily life.</p>
                            </div>
                        </div>
                    </div>
                    <div class="page-number">8</div>
                </div>
                <div class="page-back page-content left-page">
                    <!-- Chapter 3 Left -->
                    <h2 class="chapter-title" style="font-size: 1.6rem;">3. The 95% Coat</h2>
                    <div class="editorial-layout">
                        <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 1.1rem; color: var(--secondary-blue-1); font-family: var(--font-heading); font-weight: 400; font-style: italic;">Designing for your teammate</h3>
                        <img src="coat_design_2.png" alt="The 95% Coat Design" class="featured-sketch">
                        <div class="keywords">transformation • quiet luxury • warmth • symmetry • subtle pockets • strong femininity</div>
                    </div>
                    <div class="page-number">9</div>
                </div>
            </div>

            <!-- Sheet 4: Buffer / Bottle Left -->
            <div class="page paper" id="sheet-4" style="--z: 1px; z-index: 4;">
                <div class="page-content right-page front-side title-page">
                    <!-- Buffer Page -->
                    <h2 style="font-family: var(--font-heading); color: var(--columbia-blue); font-size: 2rem; font-style: italic; border-bottom: none;">Part 2</h2>
                    <h3 style="font-size: 1.5rem; margin-top: 5px;">Product Deconstructions</h3>
                    <div class="page-number">6</div>
                </div>
                <div class="page-back page-content left-page">
                    <!-- Chapter 2 Left -->
                    <h2 class="chapter-title" style="font-size: 1.6rem;">2. Bottle for a Busy Routine</h2>
                    <div class="editorial-layout">
                        <img src="larq_sketch.jpg" alt="LARQ Movement PureVis Sketch" class="featured-sketch">
                        <div class="keywords">convenience • hygiene • routine • maintenance • confidence • peace of mind</div>
                    </div>
                    <div class="page-number">7</div>
                </div>
            </div>

            <!-- Sheet 3: LM Page 4 / LM Page 5 -->
            <div class="page paper" id="sheet-3" style="--z: 2px; z-index: 5;">
                <div class="page-content right-page front-side">
                    <!-- LM Page 4 -->
                    <h3 style="margin-top: 0; margin-bottom: 20px;">lions-med</h3>
                    <div class="editorial-layout">
                        <img src="lionsmed-hero-map.png" alt="Lions-Med Nearby Clinics Map" class="featured-sketch" style="max-height: 250px; border: none; box-shadow: none; object-fit: contain;">
                        <p style="margin-top: 15px;">Lions-Med is a crowdsourced network of real-time clinic data for New Yorkers. Patients and neighbors report what they see on the ground: open clinics, wait times, medication stock, prices, and urgent needs.</p>
                        <p>Every report carries a timestamp, source, and trust signal. AI fills gaps from clinic sites, public updates, and community channels. The goal is not to guess for users or replace providers. It is to make the live state of care visible when official information is outdated, fragmented, or missing.</p>
                    </div>
                    <div class="page-number">4</div>
                </div>
                <div class="page-back page-content left-page">
                    <!-- LM Page 5 -->
                    <h3 style="margin-top: 0; margin-bottom: 20px;">prototype</h3>
                    <div class="editorial-layout">
                        <img src="lionsmed-prototype-flow.png" alt="Prototype Flow" class="featured-sketch" style="max-height: 250px; border: none; box-shadow: none; object-fit: contain;">
                        <p style="margin-top: 15px;">The prototype centered five actions: Maps, Community, Report, Alerts, and Profile. Users check nearby clinics, read recent community reports, submit an update in under 10 seconds, receive urgent alerts, and build trust over time through transparent contributor history.</p>
                        <p>We designed it to be useful before disaster too, so the network already exists when disruption hits. The first version is grounded in Morningside Heights, where students share nearby providers, pharmacies, and insurance constraints, making one person’s update useful to many others.</p>
                    </div>
                    <div class="page-number">5</div>
                </div>
            </div>

            <!-- Sheet 2: LM Page 2 / LM Page 3 -->
            <div class="page paper" id="sheet-2" style="--z: 3px; z-index: 6;">
                <div class="page-content right-page front-side">
                    <!-- LM Page 2 -->
                    <h3 style="margin-top: 0; margin-bottom: 15px;">what we heard</h3>
                    
                    <div class="quote-card">
                        <div class="quote-label">Columbia student, blizzard interview</div>
                        <p class="quote-text">“I felt helpless. I felt like I was gambling on whether the urgent care would be open and whether my condition would get worse overnight.”</p>
                    </div>
                    
                    <div class="quote-card">
                        <div class="quote-label">Student during early COVID</div>
                        <p class="quote-text">“Google gave me either ‘you’re fine’ or ‘go to the hospital’ with nothing in between.”</p>
                    </div>
                    
                    <div class="quote-card" style="margin-bottom: 10px;">
                        <div class="quote-label">PhD student supporting family</div>
                        <p class="quote-text">“Every small task took five calls to resolve.”</p>
                    </div>
                    
                    <div class="sidebar-callout">
                        <h4>Class perspective</h4>
                        <p>A class talk by Dr. Mary Foote from NYC DOHMH reinforced our direction. During COVID, clinics faced legal, technical, staffing, and process barriers to communicating updates, while residents faced fragmented and inconsistent information on the receiving end.</p>
                    </div>
                    <div class="page-number">2</div>
                </div>
                <div class="page-back page-content left-page">
                    <!-- LM Page 3 -->
                    <h3 style="margin-top: 0; margin-bottom: 15px;">the medical grey zone</h3>
                    
                    <div class="diagram-strip">
                        <span>routine care</span>
                        <span class="arrow">&larr;</span>
                        <span>medical grey zone</span>
                        <span class="arrow">&rarr;</span>
                        <span>ER</span>
                    </div>
                    
                    <p>The strongest shared pattern was the gap between routine care and the ER. People were not always facing a 911-level emergency, but they were also not fine.</p>
                    <p>They needed refills, urgent exams, chronic-care continuity, or help deciding where to go. Existing tools did not help much. Google Maps lagged. Clinic websites stayed static. Phone lines went unanswered. In that gap, people made risky trips, delayed care, or tried to self-triage under pressure. We started calling this the medical grey zone.</p>
                    
                    <div class="callout-box">
                        The problem was not just capacity. It was clarity.
                    </div>
                    <div class="page-number">3</div>
                </div>
            </div>

            <!-- Sheet 1: TOC / LM Page 1 -->
            <div class="page paper" id="sheet-1" style="--z: 4px; z-index: 7;">
                <div class="page-content right-page front-side">
                    <!-- TOC -->
                    <h2 class="chapter-title">Table of Contents</h2>
                    <ul class="toc-list">
                        <li><button class="toc-link" data-target="1">1. Lions Med</button></li>
                        <li><button class="toc-link" data-target="4">2. Bottle for a Busy Routine</button></li>
                        <li><button class="toc-link" data-target="5">3. The 95% Coat</button></li>
                        <li><button class="toc-link" data-target="6">4. Reflections</button></li>
                    </ul>
                    <div class="page-number">i</div>
                </div>
                <div class="page-back page-content left-page">
                    <!-- LM Page 1 -->
                    <h2 class="chapter-title">1. Lions Med</h2>
                    <h3 style="margin-top: 0; margin-bottom: 20px;">disaster research</h3>
                    
                    <div class="diagram-strip" style="justify-content: space-around;">
                        <span>COVID</span>
                        <span style="color: var(--cool-gray-med);">|</span>
                        <span>blizzard</span>
                        <span style="color: var(--cool-gray-med);">|</span>
                        <span>flooding / blackout</span>
                    </div>
                    
                    <p>Our early disaster research kept pointing to the same pattern. In New York City, care does not only fail when hospitals collapse. It fails earlier, when storms, shutdowns, outages, or illness make ordinary care harder to find, confirm, or reach.</p>
                    <p>Across COVID, blizzards, and hurricane-related disruption, the same issue kept appearing: people lost time to uncertainty, clinics became hard to verify, and non-emergency needs slipped into the background. That shifted our focus away from dramatic emergency response and toward the quieter breakdown of medical access.</p>
                    <div class="page-number">1</div>
                </div>
            </div>

            <!-- Sheet 0: Cover / Inside Cover -->
            <div class="page cover" id="sheet-0" style="--z: 5px; z-index: 8;">
                <div class="front-cover front-side">
                    <div class="cover-overlay"></div>
                    <div class="cover-content">
                        <div class="university-title">Columbia University</div>
                        <h1>Human-Centered Design and Innovation</h1>
                        <div class="author">Aryan Kaul</div>
                        <button class="open-book-btn" id="open-btn">Open Book</button>
                    </div>
                </div>
                <div class="page-back back-cover left-page"></div>
            </div>

        </div>"""

pattern = re.compile(r'<div class="book" id="portfolio-book">.*?</div>\s*<!-- Navigation Controls \(visible when open\) -->', re.DOTALL)
new_content = pattern.sub(new_book_content + '\n        \n        <!-- Navigation Controls (visible when open) -->', content)

with open("index.html", "w") as f:
    f.write(new_content)
