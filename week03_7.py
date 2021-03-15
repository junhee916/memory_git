#백준 9461 파도반 수열 
amount = int(input())
number_list =[0,1, 1, 1, 2, 2, 3, 4, 5, 7, 9]
for _ in range(amount):
    N = int(input())
    if N < len(number_list):
         #N의 값을 구할 때 number_list 중에 있으면 그중에 바로 출력하면 되기 때문입니다.
        print(number_list[N])
    else:
        for i in range(len(number_list), N+1): 
            # N의 값이 number_list에 없을 경우 number_list 갯수가 지금 11개이니깐 range(11, N+1) 즉 11~N 숫자가 나올 때까지 
            #for문으로 계속 실행을 해서 찾아낼 것입니다.
            number_list.append(number_list[i-1]+number_list[i-5]) 
            #삼각형 규칙에 그림과 같이 일정한 규칙이 있는 것을 알았기 때문에 그대로 대입을 해서 number_list에 넣었습니다. 
            print(number_list)
        print(number_list[N])
        #number_list에 들어간 마지막 숫자를 출력해서 보이게 하면 문제의 의도한 숫자를 나오게 할 수 있습니다. 


