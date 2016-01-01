mu1 = [1, 10];
mu2 = [1, 5];
sigma = 3;
N = 100;
X = zeros(N, 3);
X(:, 1) = ones(N, 1);
X(:, 2) = [normrnd(mu1(1), sigma, N/2, 1); normrnd(mu1(2), sigma, N/2, 1)];
X(:, 3) = [normrnd(mu2(1), sigma, N/2, 1); normrnd(mu2(2), sigma, N/2, 1)];
Y = [ones(1, N/2), -ones(1, N/2)];

hold on;
scatter(X(1:N/2, 2), X(1:N/2, 3), [], 'green')
scatter(X(N/2:N, 2), X(N/2:N, 3), [], 'red')
beta = (X' * X) \ X' * Y';
betaX = (-5:0.1:20) ;
plot(betaX, -beta(1)/beta(3) - beta(2)/beta(3) *betaX, '-c');
hold off;
