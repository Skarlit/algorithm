% we use Normal distribution (t_mu, t_sig)  to generate data
% we will try to estimate (mu, sig) using  Bayesian
%P( mu, sig | D) ~ P(mu, sig) * P(D | mu, sig)
hiX = 10;
lowX = 0;
step= 1;
dimX = (hiX - lowX) / step + 1;
[mesh_X, mesh_Y] = meshgrid(lowX:step:hiX, lowX:step:hiX);

N = 1000;  %toss
% make toss
t_mu = 5;
t_sig = 7;
genPd = makedist('Normal', t_mu, t_sig);
toss = random(genPd, 1, N);
target = zeros(dimX);
target(t_mu, t_sig) = 1;

prior = ones(dimX) / (dimX * dimX);
likelihood = prior;
posterior = prior;
observed_samples = 1;

f = figure;

for observed_samples =1:700;
    likelihood = zeros(dimX);
    for i=1:dimX
        for j=1:dimX
            % L = product of  P( {Head, tail} | mu, sig) 
             likelihood(i, j)  =  prod(normpdf(toss(1, observed_samples) , i, j));   
        end
    end
    posterior = likelihood .* prior;
    posterior = posterior / sum(sum(posterior));
    subplot(3, 2, 1);
    surf(mesh_X,  mesh_Y, prior);
    view(2);
    title('Prior Distribution');
    subplot(3, 2, 2);
    surf(mesh_X,  mesh_Y, likelihood);
    view(2);
    title('Likelihood Distribution');
    subplot(3, 2, 3);
    surf(mesh_X,  mesh_Y,  posterior);
    view(2);
    title('Posterior Distribution');
    subplot(3,2,4);
    surf(mesh_X, mesh_Y, target);
    view(2);
    title('Target Distribution');
    subplot(3,2,5);
    hist(toss(1:observed_samples));
    title('Observed Sequence');
    drawnow
    pause(0.1);
    prior = posterior;
end
