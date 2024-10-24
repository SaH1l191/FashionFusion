from rest_framework.views import APIView
from newsapi import NewsApiClient
from langchain_groq import ChatGroq
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status

class NewsSummary(APIView):
    def post(self, request):
        newsapi = NewsApiClient(api_key='')
        
        llm = ChatGroq(
            temperature=0,
            groq_api_key='',
            model_name='llama-3.1-70b-versatile'
        )

        fashion_news = newsapi.get_everything(
            q='fashion OR clothing OR apparel OR trends OR style OR runway OR designer',
            domains='vogue.com,harpersbazaar.com,elle.com,wwd.com,fashionista.com',
            from_param='2024-10-01',  
            to='2024-11-30',  
            language='en',
            sort_by='popularity',
            page=1
        )

        articles_text = ""
        for article in fashion_news['articles'][:20]: 
            description = article.get('description', '')
            content = article.get('content', '')
            articles_text += f"Description: {description}\nContent: {content}\n\n"

        prompt = f"""
        Please paraphrase and refine the content of the following fashion news articles. 
        Your task is to:
        1. Capture the key ideas and information from each article.
        2. Rephrase the content using more sophisticated and engaging language.
        3. Ensure the paraphrased version is clear, concise, and well-structured.
        4. Maintain the original meaning and intent of the articles while improving their expression.

        Here are the articles:

        {articles_text}

        Provide a cohesive, well-written paraphrase that effectively communicates the essence of these fashion news items.
        """
        
        llm_response = llm.invoke(prompt)

        # Extract just the content from the LLM's response
        if isinstance(llm_response, str):
            paraphrased_content = llm_response
        elif isinstance(llm_response, dict):
            paraphrased_content = llm_response.get('summary', [{}])[0].get('content', '')
        else:
            paraphrased_content = str(llm_response)

        return Response({"paraphrased_content": llm_response.content}, status=status.HTTP_200_OK)
