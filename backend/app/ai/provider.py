import abc
import requests
import json
from typing import Dict, Any, List, Optional
from app.services.rag import get_rag_service

class AIProvider(abc.ABC):
    @abc.abstractmethod
    def generate_chat_response(self, user_message: str, scan_context: Optional[Dict[str, Any]] = None, language: str = "English") -> Dict[str, Any]:
        """Generate grounded conversational response."""
        pass

    @abc.abstractmethod
    def generate_health_report(self, structured_ml_results: Dict[str, Any], weather_data: Dict[str, Any], rag_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate structured 6-point plant health report."""
        pass

class DemoAIProvider(AIProvider):
    def generate_chat_response(self, user_message: str, scan_context: Optional[Dict[str, Any]] = None, language: str = "English") -> Dict[str, Any]:
        rag = get_rag_service()
        retrieved = rag.retrieve(user_message + " " + (scan_context.get("disease", "") if scan_context else ""), top_k=2)

        citations = []
        for chunk, score in retrieved:
            src = chunk.metadata.get("source", chunk.metadata.get("source_file", "PlantIQ Vector Base"))
            if src not in citations:
                citations.append(src)

        if not citations:
            citations = ["PlantIQ Pathology Knowledge Base", "FAO Botanical Manual"]

        scan_context = scan_context or {}
        plant_name = scan_context.get("plant_name") or scan_context.get("plantName") or scan_context.get("plant") or "Golden Pothos"
        disease = scan_context.get("disease") or "Healthy"
        conf = scan_context.get("confidence") or 0.98
        affected = (
            scan_context.get("segmentation", {}).get("affected_percentage") or 
            scan_context.get("segmentation", {}).get("affectedPercentage") or 
            0.0
        )
        is_healthy = "healthy" in disease.lower()

        msg_lower = user_message.lower()

        # Handle multilingual queries (Hindi / Punjabi / English)
        if language == "Hindi" or "kaisi hai" in msg_lower or "kya karein" in msg_lower or "bimari" in msg_lower:
            if is_healthy:
                reply = f"नमस्ते किसान भाई! आपके पौधे (**{plant_name}**) के विश्लेषण में स्थिति **{disease} (पूर्णतः स्वस्थ)** पाई गई है (मॉडल निश्चितता: {(conf*100):.1f}%)। U-Net सेगमेंटेशन के अनुसार पत्ती पर कोई फंगल घाव नहीं है ({affected}% प्रभावित)। जो हल्के पीले या सुनहरे/क्रीम रंग के धब्बे दिख रहे हैं वो इसकी प्राकृतिक वैरीगेशन (Natural Variegation) है, कोई फंगस या बीमारी नहीं। पौधे को ब्राइट इनडायरेक्ट धूप में रखें और मिट्टी सूखने पर ही पानी दें।"
            else:
                reply = f"आपके पौधे (**{plant_name}**) के विश्लेषण में **{disease}** पाया गया है, जिसकी मॉडल निश्चितता **{(conf*100):.1f}%** है। U-Net सेगमेंटेशन के अनुसार पत्ती का **{affected}%** भाग प्रभावित है। कृपया प्रभावित पत्तियों को तुरंत काटकर हटा दें और पौधों पर सीधे पानी छिड़कने के बजाय ड्रिप सिंचाई का उपयोग करें।"
        elif language == "Punjabi" or "ਕਿਵੇਂ ਹੈ" in msg_lower:
            if is_healthy:
                reply = f"ਤੁਹਾਡੇ ਪੌਦੇ (**{plant_name}**) ਦੇ ਸਕੈਨ ਵਿੱਚ ਪੌਦਾ ਬਿਲਕੁਲ **{disease} (ਸਿਹਤਮੰਦ)** ਪਾਇਆ ਗਿਆ ਹੈ (ਮਾਡਲ ਭਰੋਸੇਯੋਗਤਾ: {(conf*100):.1f}%)। U-Net ਸੈਗਮੈਂਟੇਸ਼ਨ ਅਨੁਸਾਰ ਪੱਤੇ ਤੇ ਕੋਈ ਉੱਲੀ ਜਾਂ ਰੋਗ ਨਹੀਂ ਹੈ ({affected}%)। ਪੱਤਿਆਂ ਦੇ ਹਲਕੇ ਪੀਲੇ ਰੰਗ ਦੇ ਨਿਸ਼ਾਨ ਕੁਦਰਤੀ ਵੈਰੀਗੇਸ਼ਨ ਹਨ।"
            else:
                reply = f"ਤੁਹਾਡੇ ਪੌਦੇ (**{plant_name}**) ਦੇ ਸਕੈਨ ਵਿੱਚ **{disease}** ਪਾਇਆ ਗਿਆ ਹੈ ਜਿਸਦੀ ਮਾਡਲ ਭਰੋਸੇਯੋਗਤਾ **{(conf*100):.1f}%** ਹੈ। ਨੁਕਸਾਨੀ ਹੋਈ ਪੱਤੀ ਦਾ ਖੇਤਰਫਲ ਲਗਭਗ **{affected}%** ਹੈ।"
        elif "why" in msg_lower or "grad-cam" in msg_lower or "detected" in msg_lower:
            if is_healthy:
                reply = f"Grad-CAM explainability indicates balanced and uniform spatial feature activation across the {plant_name} lamina without localized necrotic lesions, validating a healthy baseline."
            else:
                reply = f"The model detected **{disease}** based on salient spatial features highlighted by Grad-CAM, particularly the necrotic margin boundaries and water-soaked lesions near major venation."
        elif "prevent" in msg_lower or "manage" in msg_lower or "treatment" in msg_lower:
            if is_healthy:
                reply = f"Maintenance recommendations for **{plant_name}**: (1) Provide bright indirect sunlight to preserve variegated patterns, (2) Allow top 2 inches of potting mix to dry between waterings, and (3) Ensure proper pot drainage."
            else:
                reply = f"Key agronomic interventions for **{disease}**: (1) Prune necrotic foliar margins with sanitized shears, (2) Avoid overhead sprinkler irrigation during high humidity, and (3) Apply protectant copper-based or bio-fungicide sprays."
        else:
            if is_healthy:
                reply = f"Based on the multi-layer diagnostic scan, your **{plant_name}** is **Healthy** ({(conf*100):.1f}% certainty). Foliar pigmentation and cuticle integrity are optimal."
            else:
                reply = f"Based on the multi-layer diagnostic scan for **{plant_name}**, the model identified **{disease}** with **{(conf*100):.1f}% certainty**."

        return {
            "reply": reply,
            "language": language,
            "citations": citations
        }

    def generate_health_report(
        self,
        structured_ml_results: Dict[str, Any],
        weather_data: Dict[str, Any],
        rag_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        disease = structured_ml_results.get("disease", "Healthy")
        plant = structured_ml_results.get("plant", "Golden Pothos")
        humidity = weather_data.get("humidity_percent", 74)
        temp = weather_data.get("temperature_c", 24.6)
        is_healthy = "healthy" in disease.lower()

        if "guava" in plant.lower():
            if is_healthy:
                what_detected = f"Healthy Guava (Psidium guajava / अमरूद) specimen with robust foliar canopy and active young fruit development."
                visible_symptoms = [
                    "Vibrant green elliptic-oblong leaves with prominent pinnate venation",
                    "Smooth developing fruit surfaces with intact persistent apical calyx lobes",
                    "Zero sunken necrotic lesions, anthracnose rings, or chlorotic mottling"
                ]
                env_cond = f"Recorded temperature ({temp if temp is not None else 26.5}°C) and relative humidity ({humidity if humidity is not None else 72}%) are optimal for tropical orchard canopy photosynthesis."
                mgmt = [
                    "Perform light post-harvest canopy training to maintain an open center for sunlight penetration.",
                    "Provide deep irrigation during fruit expansion intervals (every 7–10 days in dry spells).",
                    "Apply balanced NPK fertilizer (250g N, 150g P2O5, 150g K2O) and organic compost along the root drip-line."
                ]
                prev = [
                    "Install methyl eugenol pheromone traps or practice fruit bagging to protect against fruit flies (Bactrocera).",
                    "Ensure adequate soil drainage to prevent root-zone waterlogging and avoid Guava Wilt (Fusarium).",
                    "Apply prophylactic copper oxychloride (0.3%) foliar spray prior to monsoon onset."
                ]
                exp = "The Guava tree displays optimal physiological vigor. Consult an extension specialist if sudden leaf bronzing or fruit drop occurs."
            else:
                what_detected = f"{disease} identified on Guava foliage with visible focal tissue disruption."
                visible_symptoms = [
                    f"Characteristic localized foliar spotting associated with {disease}",
                    "Marginal chlorotic halos encircling primary lesion perimeter"
                ]
                env_cond = f"Relative humidity ({humidity if humidity is not None else 78}%) elevates foliar fungal sporulation risk."
                mgmt = [
                    "Prune affected branches 5 cm below infected tissue with sanitized shears.",
                    "Spray copper oxychloride (3g/liter) or systemic bio-fungicide.",
                    "Rake and destroy fallen infected leaves to eliminate fungal inoculum."
                ]
                prev = [
                    "Maintain proper tree canopy spacing to enhance air circulation.",
                    "Avoid overhead spray irrigation that wets foliage for prolonged hours."
                ]
                exp = "If foliar lesions expand across more than 20% of canopy, contact your local Krishi Vigyan Kendra (KVK) officer."
        elif "rose" in plant.lower():
            if is_healthy:
                what_detected = f"Healthy Rose ({plant} / गुलाब) foliage exhibiting glossy cellular cuticle and vigorous vegetative leaflets."
                visible_symptoms = [
                    "Glossy deep green pinnately compound leaflets with sharp serrated margins",
                    "Reddish-bronze apical terminal shoots indicating active vegetative growth",
                    "Zero black spots, powdery fungal coating, or yellow halos"
                ]
                env_cond = f"Recorded ambient microclimate ({temp if temp is not None else 25}°C, {humidity if humidity is not None else 65}% RH) provides balanced transpiration without fungal moisture accumulation."
                mgmt = [
                    "Water directly at the base of the plant using drip or soaker hoses to keep foliage dry.",
                    "Prune dead or crossing inner canes to promote an open center for horizontal airflow.",
                    "Feed with balanced rose fertilizer (NPK with micronutrients) every 4–6 weeks."
                ]
                prev = [
                    "Apply preventative neem oil spray during humid spells to deter black spot and rose aphids.",
                    "Ensure at least 6 hours of direct sunlight daily for robust flowering.",
                    "Rake and remove any fallen foliage around the base to disrupt fungal spore cycles."
                ]
                exp = "The rose plant displays optimal physiological health. Consult an extension specialist if circular dark spots or white powdery mildew develops."
            else:
                what_detected = f"{disease} identified on Rose foliage with measurable leaf tissue disruption."
                visible_symptoms = [
                    f"Foliar lesions and discoloration characteristic of {disease} on Rose",
                    "Chlorotic yellowing around infected margins"
                ]
                env_cond = f"Elevated humidity ({humidity if humidity is not None else 80}%) exacerbates fungal sporulation on rose leaves."
                mgmt = [
                    "Prune diseased leaflets and discard immediately; do not compost.",
                    "Spray bio-fungicide or copper/sulfur based spray approved for roses.",
                    "Avoid overhead wetting during evening hours."
                ]
                prev = [
                    "Ensure adequate sunlight and space between bushes for airflow.",
                    "Mulch base to prevent soil splash onto lower foliage."
                ]
                exp = "If defoliation exceeds 25%, consult a horticultural specialist for systemic fungicide guidance."
        elif is_healthy:
            what_detected = f"Optimal physiological vigor detected on {plant} with uniform foliar integrity and absent biotic pathogens."
            visible_symptoms = [
                "Vibrant green leaf lamina displaying intact cellular turgor and glossy cuticle",
                "Distinct natural foliar patterning without necrotic or chlorotic halos",
                "Intact foliar margins with zero water-soaked lesions or bacterial ooze"
            ]
            env_cond = f"Ambient temperature ({temp if temp is not None else 'optimal'}°C) and relative humidity ({humidity if humidity is not None else 'optimal'}%) provide favorable microclimate conditions for vegetative leaf expansion without fungal spore proliferation."
            mgmt = [
                "Maintain current irrigation schedule, permitting the upper soil layers to dry before re-watering.",
                "Ensure standard horticultural hygiene and clean leaf surfaces periodically.",
                "Apply balanced water-soluble fertilizer during the active vegetative cycle."
            ]
            prev = [
                "Ensure adequate sunlight exposure to sustain natural chlorophyll pigmentation.",
                "Prevent root-zone waterlogging by ensuring unrestricted soil drainage."
            ]
            exp = "Specimen is in excellent health. Continue routine monitoring for common foliar pests."
        else:
            what_detected = f"{disease} foliar condition identified on {plant} with measurable focal tissue disruption."
            visible_symptoms = [
                f"Localized foliar spots and margin discoloration characteristic of {disease}",
                "Visible contrast gradients along secondary leaf venation",
                "Chlorotic transition halo encircling primary lesion perimeter"
            ]
            env_cond = f"Relative humidity ({humidity if humidity is not None else 'elevated'}%) combined with ambient temperature ({temp if temp is not None else 'ambient'}°C) creates environmental conditions associated with increased pathogen sporulation risk. (Note: Weather is contextual, not biological proof)."
            mgmt = [
                "Prune heavily infected lower foliage with 70% alcohol-sanitized shears to arrest spore dispersion.",
                "Transition immediately from overhead sprinkler irrigation to subsurface drip watering to keep canopies dry.",
                "Consider application of protectant bio-fungicide or copper-based preventative spray to adjacent healthy leaves."
            ]
            prev = [
                "Maintain proper plant spacing (45–60 cm) to ensure continuous horizontal canopy airflow.",
                "Implement proactive crop rotation away from susceptible plant families."
            ]
            exp = "If foliar necrosis progresses across more than 30% of the canopy within 72 hours, submit a leaf tissue sample to an accredited extension laboratory."

        return {
            "what_detected": what_detected,
            "detected_condition": what_detected,
            "visible_symptoms": visible_symptoms,
            "environmental_conditions": env_cond,
            "contributing_factors": env_cond,
            "management_recommendations": mgmt,
            "management_guidelines": mgmt,
            "preventative_measures": prev,
            "prevention": "; ".join(prev),
            "expert_advice": exp,
            "expert_advisory": exp
        }

class GeminiAIProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = DemoAIProvider()

    def generate_chat_response(self, user_message: str, scan_context: Optional[Dict[str, Any]] = None, language: str = "English") -> Dict[str, Any]:
        if not self.api_key:
            return self.fallback.generate_chat_response(user_message, scan_context, language)

        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
        except Exception as e:
            print(f"[AI-PROVIDER] Failed to load google.generativeai: {e}. Falling back to dynamic provider.")
            return self.fallback.generate_chat_response(user_message, scan_context, language)

        rag = get_rag_service()
        retrieved = rag.retrieve(user_message + " " + (scan_context.get("disease", "") if scan_context else ""), top_k=2)
        context_text = "\n\n".join([f"[{c[0].metadata.get('source_file', 'KB')}]: {c[0].content}" for c in retrieved])

        scan_context = scan_context or {}
        plant_name = scan_context.get("plant_name") or scan_context.get("plantName") or scan_context.get("plant") or "Golden Pothos"
        disease = scan_context.get("disease") or "Healthy"
        pathogen = scan_context.get("pathogen") or "None (Natural Physiology)"
        conf = scan_context.get("confidence") or 0.98
        sev = scan_context.get("severity") or "Low"
        report = scan_context.get("ai_health_report") or scan_context.get("aiHealthReport") or {}
        env = scan_context.get("environmental_context") or scan_context.get("environmentalContext") or {}

        system_prompt = f"""You are the expert Plant Doctor and Agronomic Assistant on the PlantIQ platform.
The user has scanned their foliar image in PlantIQ:
- Diagnosed Plant: {plant_name}
- Diagnosed Health State: {disease}
- Pathogen: {pathogen}
- Confidence: {float(conf)*100:.1f}%
- Severity Tier: {sev}
- Local Weather: {env.get('temperature_c', '24')}°C, {env.get('humidity_percent', '70')}% RH, {env.get('weather_condition', 'Normal')}
- Observed Diagnostic Symptoms: {json.dumps(report.get('visible_symptoms', []))}
- Targeted Treatment Guidelines: {json.dumps(report.get('management_guidelines', []))}

Pathology Knowledge Base Context:
{context_text}

CRITICAL RULES:
1. ALWAYS directly answer regarding this exact specimen ({plant_name}) and its status ({disease}).
2. NEVER tell the user "you have not shared any photo" or "आपने अभी पौधे की कोई फोटो या लक्षण साझा नहीं किए हैं". The user has already uploaded and analyzed this photo!
3. If the plant is "Healthy" (e.g. Golden Pothos / Money Plant with light yellow/cream patterns):
   - Assure the user that the plant is healthy and vigorous!
   - Clarify that yellow/cream markings are natural genetic variegation, not a fungal infection or disease.
   - Advise on maintenance (bright indirect light, watering when top 2 inches of soil are dry).
4. If diseased, explain the cause, symptoms, organic remedies (pruning, neem spray), and precautions.
5. Language: Respond naturally in {language} (if user asks in Hindi/Hinglish, reply in friendly, conversational Hindi/Hinglish)."""

        candidate_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        for m_name in candidate_models:
            try:
                model = genai.GenerativeModel(m_name)
                response = model.generate_content([system_prompt, f"User asks: {user_message}"])
                reply_text = response.text.strip()
                citations = [c[0].metadata.get("source_file", "PlantIQ Pathology Database") for c in retrieved] or ["PlantIQ Agricultural Knowledge Base"]
                return {
                    "reply": reply_text,
                    "language": language,
                    "citations": citations
                }
            except Exception as e:
                print(f"Gemini {m_name} chat attempt failed ({e}), trying next model...")
                continue

        print("All Gemini models exhausted, falling back to dynamic DemoAIProvider")
        return self.fallback.generate_chat_response(user_message, scan_context, language)

    def generate_health_report(
        self,
        structured_ml_results: Dict[str, Any],
        weather_data: Dict[str, Any],
        rag_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if not self.api_key:
            return self.fallback.generate_health_report(structured_ml_results, weather_data, rag_context)

        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
        except Exception as e:
            print(f"[AI-PROVIDER] Failed to load google.generativeai: {e}. Falling back to dynamic provider.")
            return self.fallback.generate_health_report(structured_ml_results, weather_data, rag_context)

        plant = structured_ml_results.get("plant", "Plant Specimen")
        disease = structured_ml_results.get("disease", "Unknown Condition")
        pathogen = structured_ml_results.get("pathogen", "N/A")
        conf = structured_ml_results.get("confidence", 0.95)
        temp = weather_data.get("temperature_c")
        humidity = weather_data.get("humidity_percent")
        weather_desc = weather_data.get("weather_condition", "Telemetry unavailable")
        
        # Format weather string
        if temp is not None and humidity is not None:
            weather_str = f"Ambient Temperature: {temp}°C, Relative Humidity: {humidity}%, Condition: {weather_desc}"
        else:
            weather_str = "Local environmental telemetry was unavailable at time of scan."

        # Format RAG knowledge string
        rag_sources = (rag_context or {}).get("sources", [])
        rag_text = "\n".join([f"- [{s.get('document_id', 'KB')}]: {s.get('content_excerpt', '')}" for s in rag_sources]) or "Standard FAO Pathology Guidelines"

        prompt = f"""You are an agronomic advisory assistant.
CRITICAL RULES:
1. Do not override the machine-learning classification.
2. Do not invent measurements or fake environmental values.
3. Use only retrieved knowledge for factual recommendations.
4. Clearly distinguish model prediction from contextual interpretation.
5. If evidence is insufficient, say so.

Given Data:
- Machine Learning Model Prediction: {disease} on {plant}
- Model Certainty: {conf * 100:.1f}%
- Pathogen: {pathogen}
- Environmental Context: {weather_str}
- Retrieved Knowledge Chunks:
{rag_text}

Output ONLY a valid JSON object matching EXACTLY this JSON structure:
{{
  "what_detected": "Clear summary of the condition ({disease}) identified on {plant} with confidence statement.",
  "visible_symptoms": [
    "First specific foliar symptom observed on {plant} for {disease}",
    "Second specific symptom regarding lesion shape, color, margin, or variegation",
    "Third physiological indicator"
  ],
  "environmental_conditions": "Cautious scientific assessment of how microclimate parameters ({weather_str}) interact with disease risk. Note: Weather is context, not biological proof.",
  "management_recommendations": [
    "Immediate cultural action (pruning, sanitization, watering adjustment)",
    "Biological / organic remedy (e.g. neem oil, beneficial microbes)",
    "Targeted intervention if necessary, or maintenance guidance if healthy"
  ],
  "preventative_measures": [
    "First preventative strategy (ventilation, drip irrigation, sunlight)",
    "Second preventative strategy (canopy spacing, crop rotation, soil care)"
  ],
  "expert_advice": "Actionable agronomic guidance and criteria for when to consult a certified plant pathologist or extension officer."
}}
Ensure advice is tailored strictly to {plant} and {disease}. If Healthy, celebrate healthy foliage and guide proper routine maintenance.
Return PURE RAW JSON only, no markdown codeblocks."""

        candidate_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        for m_name in candidate_models:
            try:
                model = genai.GenerativeModel(m_name)
                response = model.generate_content(prompt)
                raw_text = response.text.strip()
                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[1].split("```")[0]
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].split("```")[0]

                data = json.loads(raw_text.strip())
                # Add aliases for backward compatibility
                data["detected_condition"] = data.get("what_detected", "")
                data["contributing_factors"] = data.get("environmental_conditions", "")
                data["management_guidelines"] = data.get("management_recommendations", [])
                prev = data.get("preventative_measures", [])
                data["prevention"] = "; ".join(prev) if isinstance(prev, list) else str(prev)
                data["expert_advisory"] = data.get("expert_advice", "")
                return data
            except Exception as e:
                print(f"Gemini {m_name} report generation failed ({e}), falling back immediately...")
                break

        print("Using grounded DemoAIProvider for health report")
        return self.fallback.generate_health_report(structured_ml_results, weather_data, rag_context)

class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = DemoAIProvider()

    def generate_chat_response(self, user_message: str, scan_context: Optional[Dict[str, Any]] = None, language: str = "English") -> Dict[str, Any]:
        if not self.api_key:
            return self.fallback.generate_chat_response(user_message, scan_context, language)

        try:
            import openai
            client = openai.OpenAI(api_key=self.api_key)
            rag = get_rag_service()
            retrieved = rag.retrieve(user_message, top_k=2)
            context_text = "\n\n".join([c[0].content for c in retrieved])

            system_prompt = f"""You are the PlantIQ Agronomic Assistant.
CRITICAL RULES:
1. You MUST NEVER override the trained computer vision model prediction.
2. Ground your explanations in the retrieved context:
{context_text}
3. Language: Respond in {language}.
4. Always communicate uncertainty and distinguish model predictions from biological ground truth.
Current Scan Context: {json.dumps(scan_context or {})}"""

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=400,
                temperature=0.3
            )
            return {
                "reply": response.choices[0].message.content,
                "language": language,
                "citations": [c[0].metadata.get("source_file", "PlantIQ KB") for c in retrieved] or ["PlantIQ Knowledge Base"]
            }
        except Exception:
            return self.fallback.generate_chat_response(user_message, scan_context, language)

    def generate_health_report(self, structured_ml_results: Dict[str, Any], weather_data: Dict[str, Any], rag_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self.fallback.generate_health_report(structured_ml_results, weather_data, rag_context)

def get_ai_provider() -> AIProvider:
    from app.config import settings
    if settings.GEMINI_API_KEY:
        return GeminiAIProvider(settings.GEMINI_API_KEY)
    elif settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        return OpenAIProvider(settings.OPENAI_API_KEY)
    return DemoAIProvider()
